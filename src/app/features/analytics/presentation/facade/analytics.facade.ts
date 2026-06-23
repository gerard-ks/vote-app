import { Injectable, signal, computed, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AnalyticsRepository } from '../../domain/analytics.repository';
import { AnalyticsData } from '../../domain/analytics.entity';
import { ViewState } from '@core/models/view-state.model';

@Injectable()
export class AnalyticsFacade {
  private readonly repository = inject(AnalyticsRepository);
  private readonly messageService = inject(MessageService);

  private readonly _state = signal<ViewState<AnalyticsData>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  public readonly kpis = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.kpis : [];
  });

  public readonly weeklyData = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.weeklyData : [];
  });

  public readonly activityLogs = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.activityLogs : [];
  });

  // Calcul réactif de l'échelle maximale du graphique
  public readonly maxVotes = computed(() => {
    const data = this.weeklyData();
    if (data.length === 0) return 0;
    return Math.max(...data.map((d) => d.votes));
  });

  public loadAnalytics(): void {
    this._state.set({ type: 'LOADING' });
    this.repository.getAnalytics().subscribe({
      next: (data) => this._state.set({ type: 'SUCCESS', data }),
      error: () =>
        this._state.set({ type: 'ERROR', message: 'Impossible de charger les métriques.' }),
    });
  }

  public triggerExport(): void {
    this.repository.exportData().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Export en cours',
          detail: 'Vous recevrez un email avec le lien de téléchargement sous peu.',
        });
      },
    });
  }
}
