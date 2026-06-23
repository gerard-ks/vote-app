import { Injectable, signal, computed, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PollRepository } from '../../domain/poll.repository';
import { Poll } from '../../domain/poll.entity';
import { ViewState } from '@core/models/view-state.model';

@Injectable()
export class PollsModerationFacade {
  private readonly repository = inject(PollRepository);
  private readonly messageService = inject(MessageService);

  private readonly _state = signal<ViewState<Poll[]>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  // Filtres d'interface
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _searchTerm = signal<string>('');
  private readonly _statusFilter = signal<string>('all');

  public readonly currentStatusFilter = this._statusFilter.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly pageSize = this._pageSize.asReadonly();


  public readonly errorMessage = computed(() => {
    const current = this.state();
    return current.type === 'ERROR' ? current.message : 'Une erreur inattendue est survenue.';
  });

  // 1. Filtrage réactif (Recherche + Statut)
  public readonly filteredPolls = computed(() => {
    const current = this._state();
    if (current.type !== 'SUCCESS') return [];

    let filtered = current.data;
    const term = this._searchTerm().toLowerCase();
    const status = this._statusFilter();

    if (status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (term) {
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(term) || p.createdBy.toLowerCase().includes(term),
      );
    }

    return filtered;
  });

  // 2. Pagination réactive
  public readonly paginatedPolls = computed(() => {
    const polls = this.filteredPolls();
    const start = (this._currentPage() - 1) * this._pageSize();
    return polls.slice(start, start + this._pageSize());
  });

  public readonly totalRecords = computed(() => this.filteredPolls().length);

  // --- ACTIONS ---

  public loadPolls(): void {
    this._state.set({ type: 'LOADING' });

    this.repository.getAll().subscribe({
      next: (data) => {
        this._state.set({ type: 'SUCCESS', data });
      },
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
    this.repository.closePoll(id).subscribe({
      next: () => {
        this.loadPolls();
        this.messageService.add({
          severity: 'warn',
          summary: 'Sondage clos',
          detail: 'Le sondage a été clôturé avec succès.',
        });
      },
    });
  }

  public deletePoll(id: string): void {
    this.repository.deletePoll(id).subscribe({
      next: () => {
        this.loadPolls();
        this.messageService.add({
          severity: 'success',
          summary: 'Suppression',
          detail: 'Le sondage a été supprimé.',
        });
      },
    });
  }
}
