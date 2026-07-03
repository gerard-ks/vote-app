import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AnalyticsData } from '../../domain/entities/analytics.entity';
import { ViewState } from '@core/models/view-state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExportDataUseCase } from '@features/analytics/domain/usecases/export-data.usecase';
import { GetAnalyticsUseCase } from '@features/analytics/domain/usecases/get-analytics.usecase';

@Injectable()
export class AnalyticsFacade {
  private readonly getAnalyticsUseCase = inject(GetAnalyticsUseCase);
  private readonly exportDataUseCase = inject(ExportDataUseCase);
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
    this.getAnalyticsUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this._state.set({ type: 'SUCCESS', data }),
        error: () =>
          this._state.set({ type: 'ERROR', message: 'Impossible de charger les métriques.' }),
      });
  }

  public triggerExport(): void {
    this.exportDataUseCase
      .execute()
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
