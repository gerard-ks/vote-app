export interface DashboardMetric {
  label: string;
  value: string | number;
  delta: string;
  icon: string;
  color: string;
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  alerts: string[];
}

export interface WeeklyData {
  day: string;
  votes: number;
  polls: number;
}

export interface KpiData {
  label: string;
  value: string;
  icon: string;
  trend: string;
}

export interface ActivityLog {
  action: string;
  time: string;
  user: string;
}

export interface AnalyticsData {
  kpis: KpiData[];
  weeklyData: WeeklyData[];
  activityLogs: ActivityLog[];
}
