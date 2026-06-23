import { Component, inject } from '@angular/core';
import { PollListViewComponent } from '@features/polls/presentation/smart/poll-list-view.component';
import { PollListFacade } from '@features/polls/presentation/facade/poll-list.facade';

@Component({
  selector: 'app-poll-list-page',
  template: `<app-poll-list-view></app-poll-list-view>`,
  imports: [PollListViewComponent],
})
export class PollListPageComponent {
  private readonly facade = inject(PollListFacade);

  constructor() {
    this.facade.initPage();
  }
}
