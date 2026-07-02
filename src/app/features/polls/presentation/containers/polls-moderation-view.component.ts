import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PollsModerationFacade } from '../facade/polls-moderation.facade';

@Component({
  selector: 'app-polls-moderation-view',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="container py-8 mx-auto max-w-300">
      <p-toast></p-toast>
      <p-confirmDialog
        [style]="{ width: '450px' }"
        acceptButtonStyleClass="p-button-danger"
        rejectButtonStyleClass="bg-white text-black border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
      >
      </p-confirmDialog>

      <a
        routerLink="/admin/dashboard"
        class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 no-underline cursor-pointer"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        Retour au dashboard
      </a>

      <h1 class="text-2xl font-bold text-gray-900 mb-6 m-0">Modération des sondages</h1>

      <div class="relative mb-4">
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
        ></i>
        <input
          pInputText
          type="text"
          placeholder="Rechercher par titre ou créateur..."
          (input)="onSearch($event)"
          class="w-full rounded-md border border-gray-200 bg-white pl-10! pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        @for (status of statuses; track status.value) {
          <button
            (click)="facade.updateStatusFilter(status.value)"
            class="rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer border border-transparent"
            [ngClass]="
              facade.currentStatusFilter() === status.value
                ? 'bg-primary text-primary-contrast shadow-sm'
                : 'bg-surface-100 text-muted-color hover:text-color hover:bg-surface-200'
            "
          >
            {{ status.label }}
          </button>
        }
      </div>

      @if (facade.state().type === 'ERROR') {
        <div class="p-4 rounded-md bg-red-50 text-red-600 border border-red-100 text-sm">
          {{ facade.errorMessage() }}
        </div>
      } @else {
        @if (facade.state().type === 'LOADING') {
          <div class="flex justify-center py-10">
            <i class="pi pi-spinner pi-spin text-2xl text-primary"></i>
          </div>
        }

        <div [class.hidden]="facade.state().type !== 'SUCCESS'">
          @if (facade.paginatedPollsView().length === 0) {
            <div
              class="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center"
            >
              <p class="text-sm text-gray-500 m-0">
                Aucun sondage ne correspond à votre recherche.
              </p>
            </div>
          } @else {
            <div class="space-y-3">
              @for (pollView of facade.paginatedPollsView(); track pollView.id) {
                <div
                  class="rounded-lg border border-gray-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-sm font-semibold text-gray-900 truncate m-0">
                        {{ pollView.title }}
                      </h3>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0"
                        [ngClass]="pollView.statusBadgeClass"
                      >
                        {{ pollView.statusLabel }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 m-0 mt-1">
                      par <span class="font-medium">&#64;{{ pollView.createdBy }}</span> &middot;
                      {{ pollView.totalVotes }} votes &middot; Créé le
                      {{ pollView.createdAtText }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <a
                      [routerLink]="['/admin/polls/sondage', pollView.id]"
                      class="rounded-md p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors no-underline cursor-pointer"
                      title="Voir"
                    >
                      <i class="pi pi-eye"></i>
                    </a>

                    @if (pollView.status === 'active') {
                      <button
                        (click)="facade.confirmClose(pollView.id)"
                        class="rounded-md p-2 text-yellow-500 hover:bg-yellow-50 border-none bg-transparent cursor-pointer transition-colors"
                        title="Clôturer"
                      >
                        <i class="pi pi-lock"></i>
                      </button>
                    }

                    <button
                      (click)="facade.confirmDelete(pollView.id)"
                      class="rounded-md p-2 text-red-500 hover:bg-red-50 border-none bg-transparent cursor-pointer transition-colors"
                      title="Supprimer"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              }
            </div>

            <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <p class="text-[13px] text-gray-500 m-0">
                Page <span class="font-medium text-gray-900">{{ facade.currentPage() }}</span> sur
                <span class="font-medium text-gray-900">{{ facade.totalPages() }}</span>
              </p>
              <div class="flex gap-2">
                <button
                  [disabled]="!facade.hasPreviousPage()"
                  (click)="facade.changePage(facade.currentPage() - 1)"
                  class="px-3 py-1.5 text-[13px] font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  [disabled]="!facade.hasNextPage()"
                  (click)="facade.changePage(facade.currentPage() + 1)"
                  class="px-3 py-1.5 text-[13px] font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Suivant
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PollsModerationViewComponent {
  protected readonly facade = inject(PollsModerationFacade);

  public readonly statuses = [
    { label: 'Tous', value: 'all' },
    { label: 'Actifs', value: 'active' },
    { label: 'Clos', value: 'closed' },
    { label: 'En attente', value: 'pending' },
  ];

  onSearch(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.facade.updateSearch(element.value);
  }
}
