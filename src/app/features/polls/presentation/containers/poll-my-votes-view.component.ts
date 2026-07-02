import { Component, OnInit, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PollCardComponent } from '@features/polls/presentation/components/poll-card.component';
import { PollMyVotesFacade } from '@features/polls/presentation/facade/poll-my-votes.facade';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-poll-my-votes-view',
  imports: [ProgressSpinnerModule, PollCardComponent, RouterLink],
  template: `
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-foreground">Mes Votes</h1>
      <p class="mt-2 text-muted-foreground">Retrouvez les sondages auxquels vous avez participé.</p>
    </div>

    @if (facade.loading()) {
      <div class="flex justify-center py-20">
        <p-progressSpinner />
      </div>
    } @else {
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (pollView of facade.pollViews(); track pollView.id) {
          <app-poll-card [poll]="pollView" />
        } @empty {
          <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <p class="text-lg font-medium text-muted-foreground">Vous n'avez pas encore voté</p>
            <p class="mt-1 text-sm text-muted-foreground">
              Parcourez les sondages actifs pour participer.
            </p>
            <a
              routerLink="/member"
              class="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Voir les sondages actifs
            </a>
          </div>
        }
      </div>
    }
  `,
})
export class PollMyVotesViewComponent {
  protected readonly facade = inject(PollMyVotesFacade);
}
