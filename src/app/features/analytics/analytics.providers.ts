import { Provider } from '@angular/core';
import { AnalyticsRepository } from '@features/analytics/domain/repositories/analytics.repository';
import { AnalyticsRepositoryImpl } from '@features/analytics/data/repositories/analytics.repository.impl';
import { AnalyticsDataSource } from '@features/analytics/data/datasources/analytics.datasource';
import { AnalyticsFakeDataSourceImpl } from '@features/analytics/data/datasources/analytics-fake.datasource.impl';
import {
  GetAnalyticsUseCase,
  GetAnalyticsUseCaseImpl,
} from '@features/analytics/domain/usecases/get-analytics.usecase';
import {
  ExportDataUseCase,
  ExportDataUseCaseImpl,
} from '@features/analytics/domain/usecases/export-data.usecase';
import {
  GetDashboardSummaryUseCase,
  GetDashboardSummaryUseCaseImpl,
} from '@features/analytics/domain/usecases/get-dashboard-summary.usecase';

export const providerAnalyticsFeature = (): Provider[] => {
  return [
    { provide: GetDashboardSummaryUseCase, useClass: GetDashboardSummaryUseCaseImpl },
    { provide: GetAnalyticsUseCase, useClass: GetAnalyticsUseCaseImpl },
    { provide: ExportDataUseCase, useClass: ExportDataUseCaseImpl },
    { provide: AnalyticsRepository, useClass: AnalyticsRepositoryImpl },
    { provide: AnalyticsDataSource, useClass: AnalyticsFakeDataSourceImpl },
  ];
};
