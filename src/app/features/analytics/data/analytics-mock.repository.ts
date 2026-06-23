import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AnalyticsRepository } from '../domain/analytics.repository';
import { AnalyticsData, DashboardSummary } from '../domain/analytics.entity';

@Injectable()
export class AnalyticsMockRepository implements AnalyticsRepository {
  public getDashboardSummary(): Observable<DashboardSummary> {
    const mockData: DashboardSummary = {
      metrics: [
        {
          label: 'Nouveaux sondages',
          value: '12',
          delta: '+3',
          icon: 'pi pi-chart-bar',
          color: 'text-primary',
        },
        {
          label: 'Votes enregistrés',
          value: '342',
          delta: '+58',
          icon: 'pi pi-check-square',
          color: 'text-blue-500',
        },
        {
          label: 'Nouveaux utilisateurs',
          value: '28',
          delta: '+5',
          icon: 'pi pi-users',
          color: 'text-green-500',
        },
      ],
      alerts: [
        "3 sondages expirent dans moins d'une heure",
        '2 utilisateurs signalés',
        '1 sondage atteint 500+ votes',
      ],
    };

    // On simule un délai réseau de 800ms pour tester ton spinner de chargement
    return of(mockData).pipe(delay(800));
  }

  public getAnalytics(): Observable<AnalyticsData> {
    const mockAnalytics: AnalyticsData = {
      kpis: [
        { label: 'Taux de participation', value: '68%', icon: 'pi pi-chart-line', trend: '5%' },
        { label: 'Sondages cette semaine', value: '22', icon: 'pi pi-chart-bar', trend: '12%' },
        { label: 'Nouveaux utilisateurs', value: '156', icon: 'pi pi-users', trend: '8%' },
      ],
      weeklyData: [
        { day: 'Lun', votes: 45, polls: 3 },
        { day: 'Mar', votes: 72, polls: 5 },
        { day: 'Mer', votes: 58, polls: 2 },
        { day: 'Jeu', votes: 93, polls: 7 },
        { day: 'Ven', votes: 67, polls: 4 },
        { day: 'Sam', votes: 34, polls: 1 },
        { day: 'Dim', votes: 21, polls: 0 },
      ],
      activityLogs: [
        { action: 'Sondage "Quel langage apprendre ?" créé', time: 'Il y a 2h', user: 'Charlie' },
        { action: 'Utilisateur diana@example.com désactivé', time: 'Il y a 5h', user: 'Admin' },
        { action: 'Export CSV des résultats généré', time: 'Il y a 1j', user: 'Admin' },
        { action: 'Sondage "Télétravail" clôturé', time: 'Il y a 2j', user: 'Alice' },
      ],
    };

    return of(mockAnalytics).pipe(delay(500));
  }

  public exportData(): Observable<void> {
    return of(void 0).pipe(delay(600));
  }
}
