import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsViewComponent } from '@features/analytics/presentation/containers/analytics-view.component';
import { AnalyticsFacade } from '@features/analytics/presentation/facade/analytics.facade';

@Component({
  selector: 'app-admin-analytics-page',
  imports: [AnalyticsViewComponent],
  providers: [AnalyticsFacade],
  template: `<app-analytics-view></app-analytics-view>`,
})
export class AdminAnalyticsPageComponent implements OnInit {
  private readonly facade = inject(AnalyticsFacade);

  ngOnInit(): void {
    this.facade.loadAnalytics();
  }
}
