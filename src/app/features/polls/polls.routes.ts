import { Routes } from '@angular/router';
import { providePollFeature } from './polls.providers';

export const POLL_ROUTES: Routes = [
  {
    path: '',
    providers: [providePollFeature()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@features/polls/presentation/pages/poll-list-page.component').then((m) => m.PollListPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('@features/polls/presentation/pages/poll-create-page.component').then((m) => m.PollCreatePageComponent),
      },
      {
        path: 'sondage/:id',
        loadComponent: () =>
          import('@features/polls/presentation/pages/poll-detail-page.component').then((m) => m.PollDetailPageComponent),
      },
      {
        path: 'mes-votes',
        loadComponent: () =>
          import('@features/polls/presentation/pages/my-votes-page.component').then((m) => m.MyVotesPageComponent),
      },
    ],
  },
];
