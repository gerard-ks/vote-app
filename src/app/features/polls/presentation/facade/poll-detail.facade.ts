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

@Injectable()
export class PollDetailFacade {
  // ─── INJECTIONS ───
  private readonly repository = inject(PollRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  // ─── ÉTAT LOCAL (STATE) ───
  private readonly _state = signal<ViewState<Poll>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  public readonly selectedOption = signal<string | null>(null);
  public readonly hasVoted = signal<boolean>(false);
  private readonly _localStatus = signal<'active' | 'closed' | 'pending' | null>(null);

  // ─── ÉTATS DÉRIVÉS (COMPUTED) ───
  public readonly currentPoll = computed(() => {
    const currentState = this.state();
    return currentState.type === 'SUCCESS' ? currentState.data : null;
  });

  // Gère la clôture instantanée côté client sans attendre le rechargement backend
  public readonly effectiveStatus = computed(() => {
    return this._localStatus() ?? this.currentPoll()?.status;
  });

  // Vérification des droits d'administration (Créateur ou Admin)
  public readonly canManage = computed(() => {
    const poll = this.currentPoll();
    const session = this.authStore.session();
    if (!poll || !session) return false;

    return poll.createdBy === session.name || this.authStore.isAdmin();
  });

  // Règle d'affichage conditionnel des barres de progression
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

  // ─── CYCLE DE VIE & ACCÈS DONNÉES ───
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
        takeUntilDestroyed(this.destroyRef), // Empêche les fuites de mémoire
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

  // ─── ACTIONS MÉTIERS ───
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

    // Affichage immédiat d'un état de chargement global si besoin, ou juste Optimistic UI
    this.repository
      .vote(pollId, optionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedPoll) => {
          // Met à jour le signal avec les nouvelles données du serveur (les votes recalculés)
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

    // Optimistic UI : on modifie l'affichage instantanément
    this._localStatus.set('closed');

    this.repository
      .closePoll(pollId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedPoll) => {
          // Consolidation avec la vraie donnée serveur
          this._state.set({ type: 'SUCCESS', data: updatedPoll });
          this.showToast(
            'success',
            'Sondage clôturé',
            'Les participants recevront une notification.',
          );
        },
        error: () => {
          // Rollback en cas d'erreur
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
    // 1. Sécurité de base
    if (!this.authStore.isAuthenticated()) {
      void this.router.navigate(['/']);
      return;
    }

    // 2. On lit l'état du routeur Angular pour savoir si on a un historique interne
    const navigationId = window.history.state?.navigationId;

    if (navigationId && navigationId > 1) {
      // Magie native : renvoie exactement d'où tu viens (/member/mes-votes ou /member)
      window.history.back();
    } else {
      // Fallback de sécurité : si l'utilisateur a rafraîchi la page
      // ou copié/collé le lien direct vers le sondage
      void this.router.navigate(['/member']);
    }
  }

  // ─── UTILITAIRES ───
  private showToast(severity: 'success' | 'warn' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }
}
