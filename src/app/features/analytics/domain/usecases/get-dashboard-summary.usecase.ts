import { inject, Injectable } from '@angular/core';
import { AnalyticsRepository } from '@features/analytics/domain/repositories/analytics.repository';
import { DashboardSummary } from '@features/analytics/domain/entities/analytics.entity';
import { Observable } from 'rxjs';

export abstract class GetDashboardSummaryUseCase {
  abstract execute(): Observable<DashboardSummary>;
}

@Injectable()
export class GetDashboardSummaryUseCaseImpl implements GetDashboardSummaryUseCase {
  private readonly repository = inject(AnalyticsRepository);

  public execute(): Observable<DashboardSummary> {
    return this.repository.getDashboardSummary();
  }
}
