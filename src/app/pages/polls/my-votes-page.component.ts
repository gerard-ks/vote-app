import { Component } from '@angular/core';
import { PollMyVotesViewComponent } from '@features/polls/presentation/smart/poll-my-votes-view.component';

@Component({
  selector: 'app-my-votes-page',
  imports: [PollMyVotesViewComponent],
  template: `
      <div class="container py-8">
        <app-poll-my-votes-view></app-poll-my-votes-view>
      </div>
  `,
})
export class MyVotesPageComponent {}
