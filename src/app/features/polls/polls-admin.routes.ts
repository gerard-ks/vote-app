import { Routes } from '@angular/router';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { PollRepositoryImpl } from '@features/polls/data/repositories/poll.repository.impl';

export const POLLS_ADMIN_ROUTES: Routes = [
  {
    path: '', // On est déjà dans /admin/moderation
    providers: [{ provide: PollRepository, useClass: PollRepositoryImpl }],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@features/polls/presentation/pages/admin-moderation-page.component').then(
            (m) => m.AdminModerationPageComponent,
          ),
      },
      {
        path: 'sondage/:id',
        loadComponent: () =>
          import('@features/polls/presentation/pages/poll-detail-page.component').then((m) => m.PollDetailPageComponent),
      },
    ],
  },
];
