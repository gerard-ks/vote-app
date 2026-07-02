import { Component, inject, OnInit } from '@angular/core';
import { PollDetailFacade } from '@features/polls/presentation/facade/poll-detail.facade';
import { PollDetailViewComponent } from '@features/polls/presentation/containers/poll-detail-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poll-detail-page',
  imports: [PollDetailViewComponent],
  template: ` <app-poll-detail-view /> `,
  providers: [PollDetailFacade],
})
export class PollDetailPageComponent implements OnInit {
  private readonly facade = inject(PollDetailFacade);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    const pollId = this.route.snapshot.paramMap.get('id');
    if (pollId) {
      this.facade.loadPoll(pollId);
    }
  }
}
