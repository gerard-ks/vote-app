import { Injectable, signal, inject } from '@angular/core';
import { Poll } from '@features/polls/domain/poll.entity';
import { AuthStore } from '@store/auth/auth.store';
import { PollRepository } from '@features/polls/domain/poll.repository';

@Injectable()
export class PollMyVotesFacade {
  private readonly repository = inject(PollRepository);
  private readonly authStore = inject(AuthStore);

  private readonly _polls = signal<Poll[]>([]);
  private readonly _loading = signal<boolean>(false);

  public readonly polls = this._polls.asReadonly();
  public readonly loading = this._loading.asReadonly();

  public loadMyVotes(): void {
    const email = this.authStore.session()?.email;
    if (!email) return;

    this._loading.set(true);

    // Le repository filtre les sondages où l'email est présent dans 'voters'
    this.repository.getVotedPolls(email).subscribe({
      next: (data) => {
        this._polls.set(data);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }
}
