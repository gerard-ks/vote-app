import { Component, inject, OnInit } from '@angular/core';
import { PollListViewComponent } from '@features/polls/presentation/containers/poll-list-view.component';
import { PollListFacade } from '@features/polls/presentation/facade/poll-list.facade';

@Component({
  selector: 'app-poll-list-page',
  template: `<app-poll-list-view></app-poll-list-view>`,
  providers: [PollListFacade],
  imports: [PollListViewComponent],
})
export class PollListPageComponent implements OnInit {
  private readonly facade = inject(PollListFacade);

  public ngOnInit(): void {
    this.facade.initPage();
  }
}
