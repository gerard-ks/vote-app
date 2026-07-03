import { Injectable, signal, inject, computed } from '@angular/core';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { AuthStore } from '@store/auth/auth.store';
import { mapPollToCardView } from '@features/polls/presentation/components/poll-card.ui-model';
import { GetVotedPollsUseCase } from '@features/polls/domain/usecases/get-voted-polls.usecase';

@Injectable()
export class PollMyVotesFacade {
  private readonly getVotedPollsUseCase = inject(GetVotedPollsUseCase);
  private readonly authStore = inject(AuthStore);

  private readonly _polls = signal<Poll[]>([]);
  private readonly _loading = signal<boolean>(false);

  public readonly polls = this._polls.asReadonly();
  public readonly loading = this._loading.asReadonly();

  public readonly pollViews = computed(() => {
    const isAuth = this.authStore.isAuthenticated();
    return this._polls().map((poll) => mapPollToCardView(poll, isAuth));
  });

  public loadMyVotes(): void {
    const email = this.authStore.session()?.email;
    if (!email) return;

    this._loading.set(true);

    // Le repositories filtre les sondages où l'email est présent dans 'voters'
    this.getVotedPollsUseCase.execute(email).subscribe({
      next: (data) => {
        this._polls.set(data);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }
}
