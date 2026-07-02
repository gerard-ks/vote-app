import { PollCreateViewComponent } from '@features/polls/presentation/containers/poll-create-view.component';
import { Component, inject, OnInit } from '@angular/core';
import { PollCreateFacade } from '@features/polls/presentation/facade/poll-create.facade';

@Component({
  selector: 'app-poll-create-page',
  imports: [PollCreateViewComponent],
  providers: [PollCreateFacade],
  template: `<app-poll-create-view></app-poll-create-view>`,
})
export class PollCreatePageComponent implements OnInit {
  private readonly facade = inject(PollCreateFacade);

  public ngOnInit(): void {
    this.facade.init();
  }
}
