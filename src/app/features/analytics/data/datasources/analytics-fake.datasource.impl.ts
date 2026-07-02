import { AnalyticsDataSource } from '@features/analytics/data/datasources/analytics.datasource';
import { delay, Observable, of } from 'rxjs';
import {
  AnalyticsDataModel,
  DashboardSummaryModel,
} from '@features/analytics/data/models/analytics.model';

export class AnalyticsFakeDataSourceImpl implements AnalyticsDataSource {
  exportData(): Observable<void> {
    return of(void 0).pipe(delay(600));
  }

  getAnalytics(): Observable<AnalyticsDataModel> {
    const mockAnalyticsDto: AnalyticsDataModel = {
      kpi_metrics: [
        {
          kpi_label: 'Taux de participation',
          kpi_value: '68%',
          kpi_icon: 'pi pi-chart-line',
          kpi_trend: '5%',
        },
        {
          kpi_label: 'Sondages cette semaine',
          kpi_value: '22',
          kpi_icon: 'pi pi-chart-bar',
          kpi_trend: '12%',
        },
        {
          kpi_label: 'Nouveaux utilisateurs',
          kpi_value: '156',
          kpi_icon: 'pi pi-users',
          kpi_trend: '8%',
        },
      ],
      weekly_stats: [
        { day_name: 'Lun', total_votes: 45, total_polls: 3 },
        { day_name: 'Mar', total_votes: 72, total_polls: 5 },
        { day_name: 'Mer', total_votes: 58, total_polls: 2 },
        { day_name: 'Jeu', total_votes: 93, total_polls: 7 },
        { day_name: 'Ven', total_votes: 67, total_polls: 4 },
        { day_name: 'Sam', total_votes: 34, total_polls: 1 },
        { day_name: 'Dim', total_votes: 21, total_polls: 0 },
      ],
      recent_logs: [
        {
          activity_action: 'Sondage "Quel langage apprendre ?" créé',
          timestamp_str: 'Il y a 2h',
          username: 'Charlie',
        },
        {
          activity_action: 'Utilisateur diana@example.com désactivé',
          timestamp_str: 'Il y a 5h',
          username: 'Admin',
        },
        {
          activity_action: 'Export CSV des résultats généré',
          timestamp_str: 'Il y a 1j',
          username: 'Admin',
        },
        {
          activity_action: 'Sondage "Télétravail" clôturé',
          timestamp_str: 'Il y a 2j',
          username: 'Alice',
        },
      ],
    };

    return of(mockAnalyticsDto).pipe(delay(500));
  }

  getDashboardSummary(): Observable<DashboardSummaryModel> {
    const mockDto: DashboardSummaryModel = {
      metrics_list: [
        {
          metric_label: 'Nouveaux sondages',
          metric_value: '12',
          metric_delta: '+3',
          icon_name: 'pi pi-chart-bar',
          css_color: 'text-primary',
        },
        {
          metric_label: 'Votes enregistrés',
          metric_value: '342',
          metric_delta: '+58',
          icon_name: 'pi pi-check-square',
          css_color: 'text-blue-500',
        },
        {
          metric_label: 'Nouveaux utilisateurs',
          metric_value: '28',
          metric_delta: '+5',
          icon_name: 'pi pi-users',
          css_color: 'text-green-500',
        },
      ],
      system_alerts: [
        "3 sondages expirent dans moins d'une heure",
        '2 utilisateurs signalés',
        '1 sondage atteint 500+ votes',
      ],
    };

    return of(mockDto).pipe(delay(800));
  }

}
