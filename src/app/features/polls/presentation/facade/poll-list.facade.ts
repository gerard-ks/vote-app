import { inject, Injectable, signal, computed, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { PollRepository } from '../../domain/poll.repository';
import { Poll } from '../../domain/poll.entity';
import { PollFilterType } from '../constants/polls.constants';
import { ViewState } from '@core/models/view-state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mapPollToCardView } from '@features/polls/presentation/components/poll-card.ui-model';
import { AuthStore } from '@store/auth/auth.store';

@Injectable()
export class PollListFacade {
  private readonly repository = inject(PollRepository);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _state = signal<ViewState<Poll[]>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  public readonly filter = signal<PollFilterType>('all');

  public readonly currentPage = signal<number>(1); // Page courante (1, 2, 3...)
  public readonly itemsPerPage = signal<number>(9); // Limite fixe à 9 éléments

  public readonly filteredPolls = computed(() => {
    const currentState = this.state();
    if (currentState.type !== 'SUCCESS') return [];
    const polls = currentState.data;
    const activeFilter = this.filter();
    return activeFilter === 'all' ? polls : polls.filter((p) => p.status === activeFilter);
  });

  public readonly pageCount = computed(() => {
    const totalItems = this.filteredPolls().length;
    const limit = this.itemsPerPage();
    return Math.max(1, Math.ceil(totalItems / limit));
  });

  public readonly pageItems = computed(() => {
    const filteredList = this.filteredPolls();
    const pageIdx = this.currentPage() - 1;
    const limit = this.itemsPerPage();
    const start = pageIdx * limit;
    return filteredList.slice(start, start + limit);
  });

  public readonly pageItemViews = computed(() => {
    const isAuth = this.authStore.isAuthenticated();
    return this.pageItems().map((poll) => mapPollToCardView(poll, isAuth));
  });

  public readonly pagesTimeline = computed<(number | 'ellipsis-l' | 'ellipsis-r')[]>(() => {
    const count = this.pageCount();
    const current = this.currentPage();

    if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);

    const pages: (number | 'ellipsis-l' | 'ellipsis-r')[] = Array.of(1);
    const start = Math.max(2, current - 1);
    const end = Math.min(count - 1, current + 1);

    if (start > 2) pages.push('ellipsis-l');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < count - 1) pages.push('ellipsis-r');
    pages.push(count);

    return pages;
  });

  public readonly counts = computed(() => {
    const currentState = this.state();
    const defaultCounts = { all: 0, active: 0, closed: 0, pending: 0 };
    if (currentState.type !== 'SUCCESS') return defaultCounts;
    const data = currentState.data;
    return {
      all: data.length,
      active: data.filter((p) => p.status === 'active').length,
      closed: data.filter((p) => p.status === 'closed').length,
      pending: data.filter((p) => p.status === 'pending').length,
    };
  });

  public initPage(): void {
    this._state.set({ type: 'LOADING' });
    this.repository
      .getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((polls) => {
          if (polls.length === 0) this._state.set({ type: 'EMPTY' });
          else this._state.set({ type: 'SUCCESS', data: polls });
        }),
        catchError(() => {
          this._state.set({ type: 'ERROR', message: 'Erreur réseau.' });
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public setFilter(newFilter: PollFilterType): void {
    this.filter.set(newFilter);
    this.currentPage.set(1); // Reset à la page 1 en cas de filtrage
  }

  public setPage(page: number): void {
    const maxPages = this.pageCount();
    const targetPage = Math.min(maxPages, Math.max(1, page));
    if (targetPage !== this.currentPage()) {
      this.currentPage.set(targetPage);
    }
  }
}
