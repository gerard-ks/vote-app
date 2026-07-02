import { Observable } from 'rxjs';
import {
  AnalyticsDataModel,
  DashboardSummaryModel,
} from '@features/analytics/data/models/analytics.model';

export abstract class AnalyticsDataSource {
  abstract getDashboardSummary(): Observable<DashboardSummaryModel>;
  abstract getAnalytics(): Observable<AnalyticsDataModel>;
  abstract exportData(): Observable<void>;
}
