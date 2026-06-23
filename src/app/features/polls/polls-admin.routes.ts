import { Routes } from '@angular/router';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { PollMockService } from '@features/polls/data/poll.mock-service';

export const POLLS_ADMIN_ROUTES: Routes = [
  {
    path: '', // On est déjà dans /admin/moderation
    providers: [{ provide: PollRepository, useClass: PollMockService }],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/dashboard/admin-moderation-page.component').then(
            (m) => m.AdminModerationPageComponent,
          ),
      },
      {
        path: 'sondage/:id',
        loadComponent: () =>
          import('@pages/polls/poll-detail-page.component').then((m) => m.PollDetailPageComponent),
      },
    ],
  },
];
