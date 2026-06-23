import { Routes } from '@angular/router';
import { providerUsersFeature } from '@features/users/users.providers';

export const usersRoutes: Routes = [
  {
    path: '',
    providers: [providerUsersFeature()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/dashboard/admin-users-page.component').then(
            (m) => m.AdminUsersPageComponent,
          ),
      }
    ],
  },
];
