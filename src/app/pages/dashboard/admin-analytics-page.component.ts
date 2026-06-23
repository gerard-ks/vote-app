import { Component } from '@angular/core';
import { AnalyticsViewComponent } from '@features/analytics/presentation/smart/analytics-view.component';

@Component({
  selector: 'app-admin-analytics-page',
  standalone: true,
  imports: [AnalyticsViewComponent],
  template: `<app-analytics-view></app-analytics-view>`,
})
export class AdminAnalyticsPageComponent {}
