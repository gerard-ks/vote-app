import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AnalyticsRepository } from '../../domain/analytics.repository';
import { AnalyticsData } from '../../domain/analytics.entity';
import { ViewState } from '@core/models/view-state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class AnalyticsFacade {
  private readonly repository = inject(AnalyticsRepository);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

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

  public readonly weeklyDataView = computed(() => {
    const data = this.weeklyData();
    const max = this.maxVotes();

    return data.map((d) => ({
      day: d.day,
      votes: d.votes,
      heightPercentage: max > 0 ? Math.round((d.votes / max) * 100) : 0,
    }));
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
    this.repository.getAnalytics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => this._state.set({ type: 'SUCCESS', data }),
      error: () =>
        this._state.set({ type: 'ERROR', message: 'Impossible de charger les métriques.' }),
    });
  }

  public triggerExport(): void {
    this.repository
      .exportData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
