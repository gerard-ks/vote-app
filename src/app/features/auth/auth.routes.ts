import { Routes } from '@angular/router';
import { provideAuthFeature } from './auth.providers';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    providers: [provideAuthFeature()],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('@features/auth/presentation/pages/login-page.component').then(
            (m) => m.LoginPageComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('@features/auth/presentation/pages/register-page.component').then(
            (m) => m.RegisterPageComponent,
          ),
      },
    ],
  },
];
