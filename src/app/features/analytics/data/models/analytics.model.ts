export interface DashboardMetricModel {
  metric_label: string;
  metric_value: string | number;
  metric_delta: string;
  icon_name: string;
  css_color: string;
}

export interface DashboardSummaryModel {
  metrics_list: DashboardMetricModel[];
  system_alerts: string[];
}

export interface WeeklyDataModel {
  day_name: string;
  total_votes: number;
  total_polls: number;
}

export interface KpiDataModel {
  kpi_label: string;
  kpi_value: string;
  kpi_icon: string;
  kpi_trend: string;
}

export interface ActivityLogModel {
  activity_action: string;
  timestamp_str: string;
  username: string;
}

export interface AnalyticsDataModel {
  kpi_metrics: KpiDataModel[];
  weekly_stats: WeeklyDataModel[];
  recent_logs: ActivityLogModel[];
}
