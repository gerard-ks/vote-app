import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsRepository } from '../../domain/repositories/analytics.repository';

export abstract class ExportDataUseCase {
  abstract execute(): Observable<void>;
}

@Injectable()
export class ExportDataUseCaseImpl implements ExportDataUseCase {
  private readonly repository = inject(AnalyticsRepository);

  public execute(): Observable<void> {
    return this.repository.exportData();
  }
}
