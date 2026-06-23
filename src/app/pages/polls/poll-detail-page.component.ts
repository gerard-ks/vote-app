import { Component } from '@angular/core';
import { PollDetailFacade } from '@features/polls/presentation/facade/poll-detail.facade';
import { PollDetailViewComponent } from '@features/polls/presentation/smart/poll-detail-view.component';

@Component({
  selector: 'app-poll-detail-page',
  imports: [PollDetailViewComponent],
  template: ` <app-poll-detail-view/> `,
  providers: [PollDetailFacade],
})
export class PollDetailPageComponent {
}
