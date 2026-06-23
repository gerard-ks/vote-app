import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard, publicRedirectGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // 1. ESPACE AUTHENTIFICATION
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layout/auth/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('@features/auth').then((m) => m.AUTH_ROUTES),
  },

  // 2. ESPACE MEMBRE
  {
    path: 'member',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    loadChildren: () => import('@features/polls/polls.routes').then((m) => m.POLL_ROUTES),
  },

  // 3. ESPACE ADMIN
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layout/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@features/analytics/analytics.routes').then((m) => m.ANALYTICS_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('@features/users/users.routes').then((m) => m.usersRoutes),
      },
      {
        path: 'polls',
        loadChildren: () =>
          import('@features/polls/polls-admin.routes').then((m) => m.POLLS_ADMIN_ROUTES),
      },
    ],
  },

  // 4. ESPACE PUBLIC (Toujours en dernier avant le Fallback)
  {
    path: '',
    canActivate: [publicRedirectGuard],
    loadComponent: () =>
      import('./layout/public/public-layout.component').then((m) => m.PublicLayoutComponent),
    loadChildren: () => import('@features/polls/polls.routes').then((m) => m.POLL_ROUTES),
  },

  // 5. FALLBACK (404)
  {
    path: '**',
    redirectTo: '',
  },
];
