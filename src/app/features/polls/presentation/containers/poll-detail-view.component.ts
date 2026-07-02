  import { Component, inject, signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ButtonModule } from 'primeng/button';
  import { ConfirmPopupModule } from 'primeng/confirmpopup';
  import { PollDetailFacade } from '../facade/poll-detail.facade';
  import { VoteProgressBarComponent } from '@features/polls/presentation/components/vote-progress-bar.component';
  import { AuthModalComponent } from '@features/polls/presentation/components/auth-modal.component';

  @Component({
    selector: 'app-poll-detail-view',
    imports: [
      CommonModule,
      ButtonModule,
      ConfirmPopupModule,
      VoteProgressBarComponent,
      AuthModalComponent,
    ],
    template: `
      <div class="max-w-2xl mx-auto py-8 md:py-12 font-sans box-border relative">
        <p-confirmpopup />

        <p-button
          label="Retour"
          icon="pi pi-arrow-left"
          variant="text"
          severity="secondary"
          size="small"
          styleClass="mb-6 p-0 text-sm font-semibold"
          (click)="facade.goBack()"
        />

        @let currentState = facade.state();

        @switch (currentState.type) {
          @case ('LOADING') {
            <div class="text-center py-20 text-muted-color text-sm animate-pulse">
              <i class="pi pi-spin pi-spinner text-2xl text-primary mb-3"></i>
              <p class="m-0 font-medium">Chargement du sondage...</p>
            </div>
          }

          @case ('ERROR') {
            <div
              class="flex items-center gap-3 p-4 bg-red-50/50 text-red-600 border border-red-100 rounded-xl"
            >
              <i class="pi pi-exclamation-triangle text-xl"></i>
              <div>
                <p class="font-bold m-0 text-sm">Impossible de charger le sondage.</p>
                <p class="text-xs m-0 mt-0.5 opacity-80">{{ currentState.message }}</p>
              </div>
            </div>
          }

          @case ('EMPTY') {
            <div
              class="text-center py-12 border border-dashed border-surface rounded-2xl bg-surface-card/30"
            >
              <p class="text-lg font-bold text-color m-0">Sondage introuvable</p>
              <p-button
                label="Retour à l'accueil"
                size="small"
                variant="text"
                class="mt-4 inline-block"
                (click)="facade.goBack()"
              />
            </div>
          }

          @case ('SUCCESS') {
            @let pollView = facade.pollView()!;

            <div class="animate-fade-in">
              <div class="flex justify-between items-start gap-3 mb-4 w-full">
                <h1 class="text-2xl font-black text-color tracking-tight m-0">
                  {{ pollView.title }}
                </h1>

                <div class="flex items-center gap-2 shrink-0">
                  <p-button
                    icon="pi pi-share-alt"
                    variant="text"
                    severity="secondary"
                    size="small"
                    styleClass="w-9 h-9 p-0 justify-center"
                    (click)="facade.shareLink()"
                  />

                  <span
                    class="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    [ngClass]="pollView.statusBadgeClass"
                  >
                    {{ pollView.statusBadgeText }}
                  </span>
                </div>
              </div>

              <div
                class="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-color mb-8 border-b border-surface pb-4"
              >
                <span class="inline-flex items-center gap-1.5">
                  <i class="pi pi-calendar"></i> Créé le {{ pollView.createdAtText }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <i class="pi pi-user"></i> par &#64;{{ pollView.createdByText }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <i class="pi pi-clock"></i>
                  {{ pollView.expiresAtText }}
                </span>
              </div>

              @if (facade.showResults()) {
                <div class="flex flex-col gap-5">
                  <h2 class="text-base font-bold text-color m-0 mb-2">Résultats</h2>

                  <div class="flex flex-col gap-4">
                    @for (option of pollView.options; track option.id) {
                      <app-vote-progress-bar
                        [label]="option.text"
                        [votes]="option.votes"
                        [percentage]="option.percentage"
                        [isLeader]="option.isLeader"
                      />
                    }
                  </div>

                  <div class="mt-2 flex items-center gap-1.5 text-xs text-muted-color font-medium">
                    <i class="pi pi-users"></i> {{ pollView.totalVotes }} votes au total
                  </div>

                  @if (facade.canManage()) {
                    <div class="mt-6 flex flex-wrap gap-3 border-t border-surface pt-6">
                      <p-button
                        label="Exporter en CSV"
                        icon="pi pi-download"
                        variant="outlined"
                        size="small"
                        (click)="facade.exportToCsv()"
                      />

                      @if (pollView.status === 'active') {
                        <p-button
                          label="Clôturer"
                          icon="pi pi-lock"
                          severity="danger"
                          size="small"
                          (click)="facade.confirmClosePoll($event)"
                        />
                      }
                    </div>
                  }
                </div>
              } @else if (pollView.status === 'active') {
                <div>
                  <h2 class="text-base font-bold text-color m-0 mb-2">Sélectionnez une option</h2>

                  <div
                    class="mb-3 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/40 p-3 text-xs text-blue-700 font-medium box-border"
                  >
                    <i class="pi pi-info-circle text-sm shrink-0 mt-0.5"></i>
                    <span
                      >Votre vote sera <span class="font-bold">définitif</span> et ne pourra pas
                      être modifié.</span
                    >
                  </div>

                  @if (!facade.isAuthenticated()) {
                    <div
                      class="mb-4 rounded-xl border border-orange-200 bg-orange-50/40 p-3 text-xs text-orange-600 flex items-center gap-3 font-medium box-border"
                    >
                      <i class="pi pi-lock text-sm shrink-0"></i>
                      <span>Vous devez être connecté pour participer à ce scrutin.</span>
                    </div>
                  }

                  @if (facade.isAuthenticated() && !facade.isEmailVerified()) {
                    <div
                      class="mb-4 rounded-xl border border-orange-200 bg-orange-50/40 p-3 text-xs text-orange-600 flex items-center gap-3 font-medium box-border"
                    >
                      <i class="pi pi-envelope text-sm shrink-0"></i>
                      <span>Vous devez vérifier votre adresse email avant de pouvoir voter.</span>
                    </div>
                  }

                  <div
                    class="flex flex-col gap-3 transition-opacity duration-200"
                    [ngClass]="
                      !facade.isAuthenticated() || !facade.isEmailVerified()
                        ? 'opacity-60 pointer-events-none'
                        : ''
                    "
                  >
                    @for (option of pollView.options; track option.id) {
                      <label
                        class="flex items-center gap-3 rounded-xl border p-4 box-border transition-colors"
                        [ngClass]="
                          facade.selectedOption() === option.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-surface hover:border-primary/30 cursor-pointer'
                        "
                      >
                        <input
                          type="radio"
                          name="vote"
                          [disabled]="!facade.isAuthenticated() || !facade.isEmailVerified()"
                          [value]="option.id"
                          [checked]="facade.selectedOption() === option.id"
                          (change)="facade.selectedOption.set(option.id)"
                          class="h-4 w-4 text-primary accent-primary cursor-pointer"
                        />
                        <span class="text-sm font-semibold text-color select-none">{{
                          option.text
                        }}</span>
                      </label>
                    }
                  </div>

                  <div class="mt-8 flex items-center gap-2">
                    <p-button
                      label="Annuler"
                      variant="text"
                      severity="secondary"
                      size="small"
                      styleClass="font-bold"
                      (click)="facade.goBack()"
                    />

                    @if (facade.isAuthenticated()) {
                      <p-button
                        [label]="
                          !facade.isEmailVerified() ? 'Email non vérifié' : 'Soumettre mon vote'
                        "
                        severity="primary"
                        size="small"
                        [icon]="facade.isEmailVerified() ? 'pi pi-check' : ''"
                        styleClass="font-bold px-4 shadow-sm"
                        [disabled]="!facade.selectedOption() || !facade.isEmailVerified()"
                        (click)="submitVote()"
                      />
                    } @else {
                      <p-button
                        label="Se connecter pour voter"
                        severity="primary"
                        size="small"
                        styleClass="font-bold px-4"
                        (click)="showAuthModal.set(true)"
                      />
                    }
                  </div>

                  @if (facade.canManage()) {
                    <div class="mt-6 flex flex-wrap gap-3 border-t border-surface pt-6">
                      <p-button
                        label="Exporter en CSV"
                        icon="pi pi-download"
                        variant="outlined"
                        size="small"
                        (click)="facade.exportToCsv()"
                      />

                      <p-button
                        label="Clôturer"
                        icon="pi pi-lock"
                        severity="danger"
                        size="small"
                        (click)="facade.confirmClosePoll($event)"
                      />
                    </div>
                  }
                </div>
              } @else if (pollView.status === 'pending') {
                <div
                  class="text-center py-12 border border-dashed border-surface rounded-2xl bg-surface-card/20"
                >
                  <div
                    class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-3"
                  >
                    <i class="pi pi-calendar-clock text-xl"></i>
                  </div>
                  <p class="font-bold text-color m-0">Ce sondage n'a pas encore commencé</p>
                  <p class="mt-1 text-xs text-muted-color m-0 font-medium">
                    Revenez bientôt pour exprimer votre choix.
                  </p>
                </div>
              }
            </div>
          }
        }

        <app-auth-modal
          [(visible)]="showAuthModal"
          (loginRequested)="facade.goToLogin()"
          (registerRequested)="facade.goToRegister()"
        ></app-auth-modal>
      </div>
    `,
  })
  export class PollDetailViewComponent {
    protected readonly facade = inject(PollDetailFacade);

    protected readonly showAuthModal = signal(false);

    protected submitVote(): void {
      if (!this.facade.selectedOption()) return;
      this.facade.submitVote();
    }
  }
