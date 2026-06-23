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
          import('@pages/polls/poll-list-page.component').then((m) => m.PollListPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('@pages/polls/poll-create-page.component').then((m) => m.PollCreatePageComponent),
      },
      {
        path: 'sondage/:id',
        loadComponent: () =>
          import('@pages/polls/poll-detail-page.component').then((m) => m.PollDetailPageComponent),
      },
      {
        path: 'mes-votes',
        loadComponent: () =>
          import('@pages/polls/my-votes-page.component').then((m) => m.MyVotesPageComponent),
      },
    ],
  },
];
