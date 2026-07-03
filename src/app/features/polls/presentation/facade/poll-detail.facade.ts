import { inject, Injectable, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthStore } from '@store/auth/auth.store';
import { Poll } from '../../domain/entities/poll.entity';
import { ViewState } from '@core/models/view-state.model';
import { ThemeColor } from '@shared/models/ui.models';
import { ClosePollUseCase } from '@features/polls/domain/usecases/close-poll.usecase';
import { VotePollUseCase } from '@features/polls/domain/usecases/vote-poll.usecase';
import { GetPollByIdUseCase } from '@features/polls/domain/usecases/get-poll-by-id.usecase';

export interface PollOptionView {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  isLeader: boolean;
}

export interface PollDetailView {
  title: string;
  status: 'active' | 'closed' | 'pending';
  statusBadgeText: string;
  statusTheme: ThemeColor;
  createdAtText: string;
  createdByText: string;
  expiresAtText: string;
  totalVotes: number;
  options: PollOptionView[];
}

@Injectable()
export class PollDetailFacade {
  private readonly getPollByIdUseCase = inject(GetPollByIdUseCase);
  private readonly votePollUseCase = inject(VotePollUseCase);
  private readonly closePollUseCase = inject(ClosePollUseCase);

  private readonly authStore = inject(AuthStore);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // --- ÉTAT LOCAL (STATE) ---
  private readonly _state = signal<ViewState<Poll>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  public readonly selectedOption = signal<string | null>(null);
  public readonly hasVoted = signal<boolean>(false);
  private readonly _localStatus = signal<'active' | 'closed' | 'pending' | null>(null);

  // --- ÉTATS DÉRIVÉS (COMPUTED) ---
  public readonly currentPoll = computed(() => {
    const currentState = this.state();
    return currentState.type === 'SUCCESS' ? currentState.data : null;
  });

  public readonly effectiveStatus = computed(() => {
    return this._localStatus() ?? this.currentPoll()?.status;
  });

  public readonly canManage = computed(() => {
    const poll = this.currentPoll();
    const session = this.authStore.session();
    if (!poll || !session) return false;

    return poll.createdBy === session.name || this.authStore.isAdmin();
  });

  public readonly showResults = computed(() => {
    const poll = this.currentPoll();
    if (!poll) return false;

    return (
      this.hasVoted() ||
      this.effectiveStatus() === 'closed' ||
      (poll.showResultsBeforeClose && poll.totalVotes > 0)
    );
  });

  public readonly maxVotes = computed(() => {
    const poll = this.currentPoll();
    if (!poll || poll.options.length === 0) return 0;
    return Math.max(...poll.options.map((o) => o.votes));
  });

  // RELAIS DU STORE D'AUTHENTIFICATION
  public readonly isAuthenticated = computed(() => this.authStore.isAuthenticated());
  public readonly isEmailVerified = computed(
    () => this.authStore.session()?.emailVerified ?? false,
  );

  // LE CERVEAU QUI PRÉPARE LA DONNÉE POUR LE HTML
  public readonly pollView = computed<PollDetailView | null>(() => {
    const poll = this.currentPoll();
    if (!poll) return null;

    const currentStatus = this.effectiveStatus();
    const isClosed = currentStatus === 'closed';
    const isActive = currentStatus === 'active';

    const createdAtDate = new Date(poll.createdAt).toLocaleDateString('fr-FR');
    const expiresAtDate = new Date(poll.expiresAt).toLocaleDateString('fr-FR');

    let expiresAtText = `Expire le ${expiresAtDate}`;
    if (isClosed) expiresAtText = `Clos le ${expiresAtDate}`;
    if (currentStatus === 'pending') expiresAtText = `Démarre le ${createdAtDate}`;

    const maxV = this.maxVotes();
    const total = poll.totalVotes;

    return {
      title: poll.title,
      status: currentStatus ?? 'pending',
      statusBadgeText: isClosed ? 'Clos' : isActive ? 'Actif' : 'En attente',

      statusTheme: isActive ? 'success' : isClosed ? 'danger' : 'warning',

      createdAtText: createdAtDate,
      createdByText: `par @${poll.createdBy}`,
      expiresAtText,
      totalVotes: total,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes,
        percentage: total > 0 ? Math.round((opt.votes / total) * 100) : 0,
        isLeader: total > 0 && opt.votes === maxV && maxV > 0,
      })),
    };
  });

  // CYCLE DE VIE & ACCÈS DONNÉES
  public loadPoll(pollId: string): void {
    this._state.set({ type: 'LOADING' });

    this.getPollByIdUseCase
      .execute(pollId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((poll) => {
          if (!poll) {
            this._state.set({ type: 'EMPTY' });
          } else {
            this._state.set({ type: 'SUCCESS', data: poll });
          }
        }),
        catchError(() => {
          this._state.set({ type: 'ERROR', message: 'Erreur réseau.' });
          return EMPTY;
        }),
      )
      .subscribe();
  }

  //  ACTIONS MÉTIERS
  public submitVote(): void {
    const optionId = this.selectedOption();
    const pollId = this.currentPoll()?.id;
    const session = this.authStore.session();

    if (!session) {
      this.showToast('error', 'Accès refusé', 'Vous devez être connecté pour voter.');
      return;
    }

    if (!session.emailVerified) {
      this.showToast('warn', 'Action requise', 'Veuillez vérifier votre email avant de voter.');
      return;
    }

    if (!optionId || !pollId) return;

    this.votePollUseCase
      .execute({ pollId, optionId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedPoll) => {
          this._state.set({ type: 'SUCCESS', data: updatedPoll });
          this.hasVoted.set(true);
          this.showToast('success', 'A voté !', 'Votre vote a été enregistré avec succès.');
        },
        error: () => {
          this.showToast('error', 'Erreur', "Impossible d'enregistrer votre vote.");
        },
      });
  }

  public closePoll(): void {
    const pollId = this.currentPoll()?.id;
    if (!pollId) return;

    this._localStatus.set('closed');

    this.closePollUseCase
      .execute(pollId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedPoll) => {
          this._state.set({ type: 'SUCCESS', data: updatedPoll });
          this.showToast(
            'success',
            'Sondage clôturé',
            'Les participants recevront une notification.',
          );
        },
        error: () => {
          this._localStatus.set(null);
          this.showToast('error', 'Erreur', 'Impossible de clôturer le sondage.');
        },
      });
  }

  public generateCsvData(): string | null {
    const poll = this.currentPoll();
    if (!poll) return null;

    const header = 'Option,Votes,Pourcentage\n';
    const rows = poll.options
      .map((o) => {
        const percentage = poll.totalVotes > 0 ? ((o.votes / poll.totalVotes) * 100).toFixed(1) : 0;
        return `"${o.text}",${o.votes},${percentage}%`;
      })
      .join('\n');

    return header + rows;
  }

  //  UTILITAIRES
  private showToast(severity: 'success' | 'warn' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }
}
