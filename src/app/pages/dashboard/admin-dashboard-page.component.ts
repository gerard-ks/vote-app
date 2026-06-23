import { Component } from '@angular/core';
import {
  AnalyticsDashboardViewComponent
} from '@features/analytics/presentation/smart/analytics-dashboard-view.component';

@Component({
  selector: 'app-dashboard-dashboard-page',
  imports: [AnalyticsDashboardViewComponent],
  template: `
    <div class="container py-8 md:py-12">
      <app-analytics-dashboard-view></app-analytics-dashboard-view>
    </div>
  `,
})
export class AdminDashboardPageComponent {}
