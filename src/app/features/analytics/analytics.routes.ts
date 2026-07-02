import { Routes } from '@angular/router';
import { providerAnalyticsFeature } from '@features/analytics/analytics.providers';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    providers: [providerAnalyticsFeature()],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/analytics/presentation/pages/admin-dashboard-page.component').then(
            (m) => m.AdminDashboardPageComponent,
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('@features/analytics/presentation/pages/admin-analytics-page.component').then(
            (m) => m.AdminAnalyticsPageComponent,
          ),
      },
      {
        // Redirection interne au module si on tape juste /admin
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
