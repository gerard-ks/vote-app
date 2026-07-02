import { Component, inject, OnInit } from '@angular/core';
import {
  AnalyticsDashboardViewComponent
} from '@features/analytics/presentation/containers/analytics-dashboard-view.component';
import { AnalyticsDashboardFacade } from '@features/analytics/presentation/facade/analytics-dashboard.facade';

@Component({
  selector: 'app-dashboard-dashboard-page',
  imports: [AnalyticsDashboardViewComponent],
  providers: [AnalyticsDashboardFacade],
  template: `
    <div class="container py-8 md:py-12">
      <app-analytics-dashboard-view></app-analytics-dashboard-view>
    </div>
  `,
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly facade = inject(AnalyticsDashboardFacade);

  public ngOnInit(): void {
    this.facade.loadDashboard();
  }
}
