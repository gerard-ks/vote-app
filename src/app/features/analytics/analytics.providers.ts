import { Provider } from '@angular/core';
import { AnalyticsRepository } from '@features/analytics/domain/analytics.repository';
import { AnalyticsMockRepository } from '@features/analytics/data/analytics-mock.repository';

export const providerAnalyticsFeature = (): Provider[] => {
  return [{ provide: AnalyticsRepository, useClass: AnalyticsMockRepository }];
};
