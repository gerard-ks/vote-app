import { Component, inject, OnInit } from '@angular/core';
import { PollsModerationViewComponent } from '@features/polls/presentation/containers/polls-moderation-view.component';
import { PollsModerationFacade } from '@features/polls/presentation/facade/polls-moderation.facade';

@Component({
  selector: 'app-admin-moderation-page',
  imports: [PollsModerationViewComponent],
  providers: [PollsModerationFacade],
  template: `<app-polls-moderation-view></app-polls-moderation-view>`,
})
export class AdminModerationPageComponent implements OnInit {
  private readonly facade = inject(PollsModerationFacade);

  public ngOnInit(): void {
    this.facade.loadPolls();
  }
}
