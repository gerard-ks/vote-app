import { Component } from '@angular/core';
import { PollsModerationViewComponent } from '@features/polls/presentation/smart/polls-moderation-view.component';

@Component({
  selector: 'app-admin-moderation-page',
  standalone: true,
  imports: [PollsModerationViewComponent],
  template: `<app-polls-moderation-view></app-polls-moderation-view>`,
})
export class AdminModerationPageComponent {}
