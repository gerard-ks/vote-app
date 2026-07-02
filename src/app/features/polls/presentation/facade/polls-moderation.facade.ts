import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PollRepository } from '../../domain/poll.repository';
import { Poll, PollStatus } from '../../domain/poll.entity';
import { ViewState } from '@core/models/view-state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeColor } from '@shared/models/ui.models';

export interface PollModerationView {
  id: string;
  title: string;
  status: PollStatus;
  statusLabel: string;
  statusTheme: ThemeColor;
  createdBy: string;
  totalVotes: number;
  createdAtText: string;
}

@Injectable()
export class PollsModerationFacade {
  private readonly repository = inject(PollRepository);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _state = signal<ViewState<Poll[]>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  // ÉTAT LOCAL DES FILTRES
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _searchTerm = signal<string>('');
  private readonly _statusFilter = signal<string>('all');

  public readonly currentStatusFilter = this._statusFilter.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();

  // DÉRIVATIONS (COMPUTED)
  public readonly errorMessage = computed(() => {
    const current = this.state();
    return current.type === 'ERROR' ? current.message : 'Une erreur inattendue est survenue.';
  });

  private readonly filteredPolls = computed(() => {
    const current = this._state();
    if (current.type !== 'SUCCESS') return [];

    let filtered = current.data;
    const term = this._searchTerm().toLowerCase();
    const status = this._statusFilter();

    if (status !== 'all') filtered = filtered.filter((p) => p.status === status);
    if (term) {
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(term) || p.createdBy.toLowerCase().includes(term),
      );
    }
    return filtered;
  });

  // Pagination calculée côté Façade
  public readonly totalPages = computed(() => {
    const total = this.filteredPolls().length;
    return Math.max(1, Math.ceil(total / this._pageSize()));
  });

  public readonly hasNextPage = computed(() => this._currentPage() < this.totalPages());
  public readonly hasPreviousPage = computed(() => this._currentPage() > 1);

  // Données prêtes à être affichées (UI-Model)
  public readonly paginatedPollsView = computed<PollModerationView[]>(() => {
    const polls = this.filteredPolls();
    const start = (this._currentPage() - 1) * this._pageSize();
    const paginated = polls.slice(start, start + this._pageSize());

    return paginated.map((poll) => ({
      id: poll.id,
      title: poll.title,
      status: poll.status,
      statusLabel:
        poll.status === 'active' ? 'Actif' : poll.status === 'closed' ? 'Clos' : 'En attente',
      statusTheme:
        poll.status === 'active' ? 'success' : poll.status === 'closed' ? 'danger' : 'warning',
      createdBy: poll.createdBy,
      totalVotes: poll.totalVotes,
      createdAtText: new Date(poll.createdAt).toLocaleDateString('fr-FR'),
    }));
  });

  // ACTIONS MÉTIER
  public loadPolls(): void {
    this._state.set({ type: 'LOADING' });
    this.repository
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this._state.set({ type: 'SUCCESS', data }),
        error: () =>
          this._state.set({ type: 'ERROR', message: 'Impossible de charger les sondages.' }),
      });
  }

  public updateSearch(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1);
  }

  public updateStatusFilter(status: string): void {
    this._statusFilter.set(status);
    this._currentPage.set(1);
  }

  public changePage(page: number): void {
    this._currentPage.set(page);
  }

  public closePoll(id: string): void {
    this.repository
      .closePoll(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedPoll) => {
          const current = this._state();
          if (current.type === 'SUCCESS') {
            const newData = current.data.map((p) => (p.id === id ? updatedPoll : p));
            this._state.set({ type: 'SUCCESS', data: newData });
          }
          this.messageService.add({
            severity: 'warn',
            summary: 'Sondage clos',
            detail: 'Le sondage a été clôturé.',
          });
        },
      });
  }

  public deletePoll(id: string): void {
    this.repository
      .deletePoll(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const current = this._state();
          if (current.type === 'SUCCESS') {
            const newData = current.data.filter((p) => p.id !== id);
            this._state.set({ type: 'SUCCESS', data: newData });

            // Sécurité : si on supprime le dernier élément de la page, on recule
            if (this.paginatedPollsView().length === 0 && this._currentPage() > 1) {
              this._currentPage.update((p) => p - 1);
            }
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Suppression',
            detail: 'Le sondage a été supprimé.',
          });
        },
      });
  }
}
