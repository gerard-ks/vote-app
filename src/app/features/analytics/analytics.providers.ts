import { Provider } from '@angular/core';
import { AnalyticsRepository } from '@features/analytics/domain/analytics.repository';
import { AnalyticsRepositoryImpl } from '@features/analytics/data/repositories/analytics.repository.impl';
import { AnalyticsDataSource } from '@features/analytics/data/datasources/analytics.datasource';
import { AnalyticsFakeDataSourceImpl } from '@features/analytics/data/datasources/analytics-fake.datasource.impl';

export const providerAnalyticsFeature = (): Provider[] => {
  return [
    { provide: AnalyticsRepository, useClass: AnalyticsRepositoryImpl },
    { provide: AnalyticsDataSource, useClass: AnalyticsFakeDataSourceImpl }
  ];
};
