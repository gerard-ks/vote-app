import { Component, inject, OnInit } from '@angular/core';
import { PollMyVotesViewComponent } from '@features/polls/presentation/containers/poll-my-votes-view.component';
import { PollMyVotesFacade } from '@features/polls/presentation/facade/poll-my-votes.facade';

@Component({
  selector: 'app-my-votes-page',
  imports: [PollMyVotesViewComponent],
  providers: [PollMyVotesFacade],
  template: `
    <div class="container py-8">
      <app-poll-my-votes-view></app-poll-my-votes-view>
    </div>
  `,
})
export class MyVotesPageComponent implements OnInit {
  private readonly facade = inject(PollMyVotesFacade);

  public ngOnInit(): void {
    this.facade.loadMyVotes();
  }
}
