import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AnalyticsRepository } from '../../domain/repositories/analytics.repository';
import { AnalyticsData, DashboardSummary } from '../../domain/entities/analytics.entity';
import { AnalyticsDataSource } from '../datasources/analytics.datasource';
import { AnalyticsMapper } from '../mappers/analytics.mapper';

@Injectable()
export class AnalyticsRepositoryImpl implements AnalyticsRepository {
  private readonly dataSource = inject(AnalyticsDataSource);

  public getDashboardSummary(): Observable<DashboardSummary> {
    return this.dataSource.getDashboardSummary().pipe(
      map((dto) => AnalyticsMapper.toDashboardSummary(dto)),
    );
  }

  public getAnalytics(): Observable<AnalyticsData> {
    return this.dataSource.getAnalytics().pipe(
      map((dto) => AnalyticsMapper.toAnalyticsData(dto)),
    );
  }

  public exportData(): Observable<void> {
    return this.dataSource.exportData();
  }
}
