import { inject, Injectable, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthStore } from '@store/auth/auth.store';
import { PollRepository } from '../../domain/poll.repository';
import { Poll } from '../../domain/poll.entity';
import { ViewState } from '@core/models/view-state.model';

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
  statusBadgeClass: string;
  createdAtText: string;
  createdByText: string;
  expiresAtText: string;
  totalVotes: number;
  options: PollOptionView[];
}

@Injectable()
export class PollDetailFacade {

  private readonly repository = inject(PollRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  // ÉTAT LOCAL (STATE)
  private readonly _state = signal<ViewState<Poll>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  public readonly selectedOption = signal<string | null>(null);
  public readonly hasVoted = signal<boolean>(false);
  private readonly _localStatus = signal<'active' | 'closed' | 'pending' | null>(null);

  // ÉTATS DÉRIVÉS (COMPUTED)
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

    const isClosed = poll.status === 'closed';
    const isActive = poll.status === 'active';

    const createdAtDate = new Date(poll.createdAt).toLocaleDateString('fr-FR');
    const expiresAtDate = new Date(poll.expiresAt).toLocaleDateString('fr-FR');

    let expiresAtText = `Expire le ${expiresAtDate}`;
    if (isClosed) expiresAtText = `Clos le ${expiresAtDate}`;
    if (poll.status === 'pending') expiresAtText = `Démarre le ${createdAtDate}`;

    const maxV = this.maxVotes();
    const total = poll.totalVotes;

    return {
      title: poll.title,
      status: poll.status,
      statusBadgeText: isClosed ? 'Clos' : isActive ? 'Actif' : 'En attente',
      statusBadgeClass: isActive
        ? 'bg-emerald-50 text-emerald-600'
        : isClosed
          ? 'bg-red-50 text-red-600'
          : 'bg-orange-50 text-orange-600',
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
  public initPage(): void {
    this._state.set({ type: 'LOADING' });
    const pollId = this.route.snapshot.paramMap.get('id');

    if (!pollId) {
      this._state.set({ type: 'ERROR', message: 'Identifiant manquant.' });
      return;
    }

    this.repository
      .getById(pollId)
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

    this.repository
      .vote(pollId, optionId)
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

  public confirmClosePoll(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Cette action est irréversible. Les participants seront notifiés.',
      header: 'Clôturer ce sondage ?',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Clôturer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.closePoll();
      },
    });
  }

  private closePoll(): void {
    const pollId = this.currentPoll()?.id;
    if (!pollId) return;

    this._localStatus.set('closed');

    this.repository
      .closePoll(pollId)
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

  public exportToCsv(): void {
    const poll = this.currentPoll();
    if (!poll) return;

    const header = 'Option,Votes,Pourcentage\n';
    const rows = poll.options
      .map((o) => {
        const percentage = poll.totalVotes > 0 ? ((o.votes / poll.totalVotes) * 100).toFixed(1) : 0;
        return `"${o.text}",${o.votes},${percentage}%`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `sondage-${poll.id}-resultats.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('success', 'Export réussi', 'Le fichier CSV a été téléchargé.');
  }

  public async shareLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.showToast('success', 'Lien copié', 'Le lien a été copié dans le presse-papier !');
    } catch {
      this.showToast('error', 'Erreur', 'Impossible de copier le lien.');
    }
  }

  public goBack(): void {
    if (!this.authStore.isAuthenticated()) {
      void this.router.navigate(['/']);
      return;
    }

    const navigationId = window.history.state?.navigationId;
    if (navigationId && navigationId > 1) {
      window.history.back();
    } else {
      void this.router.navigate(['/member']);
    }
  }

  // Routage pour la modale d'authentification
  public goToLogin(): void {
    void this.router.navigate(['/auth/login']);
  }

  public goToRegister(): void {
    void this.router.navigate(['/auth/register', { mode: 'register' }]);
  }

  //  UTILITAIRES
  private showToast(severity: 'success' | 'warn' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }
}
