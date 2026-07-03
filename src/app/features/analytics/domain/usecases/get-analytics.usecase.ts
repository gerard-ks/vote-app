import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsData } from '../../domain/entities/analytics.entity';
import { AnalyticsRepository } from '../../domain/repositories/analytics.repository';

export abstract class GetAnalyticsUseCase {
  abstract execute(): Observable<AnalyticsData>;
}

@Injectable()
export class GetAnalyticsUseCaseImpl implements GetAnalyticsUseCase {
  private readonly repository = inject(AnalyticsRepository);

  public execute(): Observable<AnalyticsData> {
    return this.repository.getAnalytics();
  }
}
