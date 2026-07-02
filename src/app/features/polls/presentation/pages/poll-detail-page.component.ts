import { Component, inject, OnInit } from '@angular/core';
import { PollDetailFacade } from '@features/polls/presentation/facade/poll-detail.facade';
import { PollDetailViewComponent } from '@features/polls/presentation/containers/poll-detail-view.component';

@Component({
  selector: 'app-poll-detail-page',
  imports: [PollDetailViewComponent],
  template: ` <app-poll-detail-view /> `,
  providers: [PollDetailFacade],
})
export class PollDetailPageComponent implements OnInit {
  private readonly facade = inject(PollDetailFacade);

  public ngOnInit(): void {
    this.facade.initPage();
  }
}
