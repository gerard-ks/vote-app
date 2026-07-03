import { Routes } from '@angular/router';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';
import { PollRepositoryImpl } from '@features/polls/data/repositories/poll.repository.impl';
import { providePollFeature } from '@features/polls/polls.providers';

export const POLLS_ADMIN_ROUTES: Routes = [
  {
    path: '', // On est déjà dans /admin/moderation
    providers: [providePollFeature()],
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
          import('@features/polls/presentation/pages/poll-detail-page.component').then(
            (m) => m.PollDetailPageComponent,
          ),
      },
    ],
  },
];
