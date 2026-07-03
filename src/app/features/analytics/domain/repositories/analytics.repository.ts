import { Observable } from 'rxjs';
import { AnalyticsData, DashboardSummary } from '../entities/analytics.entity';

export abstract class AnalyticsRepository {
  abstract getDashboardSummary(): Observable<DashboardSummary>;
  abstract getAnalytics(): Observable<AnalyticsData>;
  abstract exportData(): Observable<void>;
}
