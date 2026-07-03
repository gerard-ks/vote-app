import { AnalyticsData, DashboardSummary } from '@features/analytics/domain/entities/analytics.entity';
import {
  AnalyticsDataModel,
  DashboardSummaryModel,
} from '@features/analytics/data/models/analytics.model';

export class AnalyticsMapper {
  static toDashboardSummary(model: DashboardSummaryModel): DashboardSummary {
    return {
      metrics: model.metrics_list.map((m) => ({
        label: m.metric_label,
        value: m.metric_value,
        delta: m.metric_delta,
        icon: m.icon_name,
        color: m.css_color,
      })),
      alerts: model.system_alerts,
    };
  }

  static toAnalyticsData(model: AnalyticsDataModel): AnalyticsData {
    return {
      kpis: model.kpi_metrics.map((k) => ({
        label: k.kpi_label,
        value: k.kpi_value,
        icon: k.kpi_icon,
        trend: k.kpi_trend,
      })),
      weeklyData: model.weekly_stats.map((w) => ({
        day: w.day_name,
        votes: w.total_votes,
        polls: w.total_polls,
      })),
      activityLogs: model.recent_logs.map((l) => ({
        action: l.activity_action,
        time: l.timestamp_str,
        user: l.username,
      })),
    };
  }
}
