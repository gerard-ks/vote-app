import { PollCreateViewComponent } from '@features/polls/presentation/smart/poll-create-view.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-poll-create-page',
  imports: [PollCreateViewComponent],
  template: `<app-poll-create-view></app-poll-create-view>`,
})
export class PollCreatePageComponent {
}
