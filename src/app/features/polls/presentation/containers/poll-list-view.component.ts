import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { PollListFacade } from '../facade/poll-list.facade';
import { POLL_FILTER_CONFIG } from '../constants/polls.constants';
import { PollCardComponent } from '@features/polls/presentation/components/poll-card.component';
import { AuthStore } from '@store/auth/auth.store';
import { ThemeColor } from '@shared/models/ui.models';

@Component({
  selector: 'app-poll-list-view',
  imports: [CommonModule, TabsModule, CardModule, ButtonModule, PollCardComponent, RouterLink],
  template: `
    <div class="flex flex-col gap-6 w-full font-sans max-w-7xl mx-auto box-border">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-color tracking-tight m-0">Sondages</h1>
          <p class="mt-2 text-muted-color m-0 text-sm font-medium">
            Participez aux sondages actifs ou consultez les résultats.
          </p>
        </div>

        @if (store.canCreate()) {
          <p-button
            label="Créer un sondage"
            icon="pi pi-plus"
            severity="primary"
            size="small"
            routerLink="/member/create"
            styleClass="text-sm font-bold px-4 py-2 rounded-xl shrink-0 shadow-sm shadow-primary/10"
          />
        }
      </div>

      @if (!store.isAuthenticated()) {
        <div
          class="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 box-border"
        >
          <i class="pi pi-sparkles text-primary text-lg shrink-0 mt-0.5"></i>
          <div class="flex-1 text-sm">
            <p class="font-bold text-color m-0">Rejoignez la communauté</p>
            <p class="text-muted-color m-0 text-xs mt-0.5 font-medium">
              Connectez-vous pour voter et créer vos propres sondages.
            </p>
          </div>
          <p-button
            label="Se connecter"
            severity="primary"
            size="small"
            routerLink="/auth/login"
            styleClass="text-xs font-bold px-3 shrink-0"
          />
        </div>
      }

      <div
        class="flex flex-col sm:flex-row justify-between sm:items-center border-b border-surface pb-1 gap-4"
      >
        <p-tabs [value]="facade.filter()">
          <p-tablist class="border-none gap-1">
            @for (tab of tabsConfig(); track tab.value) {
              <p-tab
                [value]="tab.value"
                (click)="facade.setFilter(tab.value)"
                class="text-sm font-bold"
              >
                <div class="flex items-center gap-2">
                  <span>{{ tab.label }}</span>
                  <span [class]="tab.badgeClass">{{ tab.count }}</span>
                </div>
              </p-tab>
            }
          </p-tablist>
        </p-tabs>
        <span
          class="text-xs font-bold text-muted-color uppercase tracking-wider font-mono sm:self-center shrink-0"
        >
          {{ facade.filteredPolls().length }} résultat{{
            facade.filteredPolls().length !== 1 ? 's' : ''
          }}
        </span>
      </div>

      @let currentState = facade.state();

      @switch (currentState.type) {
        @case ('LOADING') {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div
                class="h-56 bg-surface-card/50 animate-pulse rounded-xl border border-surface"
              ></div>
            }
          </div>
        }

        @case ('ERROR') {
          <div
            class="flex items-center gap-3 p-4 bg-red-50/50 text-red-600 border border-red-100 rounded-xl"
          >
            <i class="pi pi-exclamation-triangle text-xl"></i>
            <div>
              <p class="font-bold m-0 text-sm">Oups, un problème est survenu.</p>
              <p class="text-xs m-0 mt-0.5 opacity-80">{{ currentState.message }}</p>
            </div>
          </div>
        }

        @case ('EMPTY') {
          <div
            class="animate-fade-in flex flex-col items-center justify-center py-20 text-center border border-dashed border-surface rounded-2xl bg-surface-card/30"
          >
            <p class="text-lg font-bold text-muted-color m-0">Aucun sondage trouvé</p>
            <p class="mt-1 text-sm text-muted-color m-0 font-medium">
              La base de données est actuellement vide.
            </p>
          </div>
        }

        @case ('SUCCESS') {
          @if (facade.pageItems().length > 0) {
            <div class="flex flex-col gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (pollView of facade.pageItemViews(); track pollView.id) {
                  <app-poll-card [poll]="pollView" [index]="$index"></app-poll-card>
                }
              </div>

              @if (facade.pageCount() > 1) {
                <nav
                  role="navigation"
                  aria-label="pagination"
                  class="mx-auto flex w-full justify-center mt-8 box-border"
                >
                  <ul
                    class="flex flex-row items-center gap-1 list-none p-0 m-0 font-sans text-sm font-medium"
                  >
                    <li>
                      <p-button
                        label="Précédent"
                        icon="pi pi-chevron-left"
                        variant="text"
                        severity="secondary"
                        size="small"
                        [disabled]="facade.currentPage() === 1"
                        class="font-bold text-slate-600"
                        (click)="facade.setPage(facade.currentPage() - 1)"
                      />
                    </li>

                    @for (p of facade.pagesTimeline(); track $index) {
                      <li>
                        @if (p === 'ellipsis-l' || p === 'ellipsis-r') {
                          <span class="flex h-9 w-9 items-center justify-center text-slate-400">
                            <i class="pi pi-ellipsis-h text-xs tracking-widest"></i>
                          </span>
                        } @else {
                          <p-button
                            [label]="p.toString()"
                            [variant]="p === facade.currentPage() ? undefined : 'text'"
                            [severity]="p === facade.currentPage() ? 'primary' : 'secondary'"
                            size="small"
                            class="w-9 h-9 p-0 justify-center font-bold"
                            [ngClass]="
                              p === facade.currentPage() ? 'shadow-sm shadow-indigo-600/10' : ''
                            "
                            (click)="facade.setPage(p)"
                          />
                        }
                      </li>
                    }

                    <li>
                      <p-button
                        label="Suivant"
                        icon="pi pi-chevron-right"
                        iconPos="right"
                        variant="text"
                        severity="secondary"
                        size="small"
                        [disabled]="facade.currentPage() === facade.pageCount()"
                        class="font-bold text-slate-600"
                        (click)="facade.setPage(facade.currentPage() + 1)"
                      />
                    </li>
                  </ul>
                </nav>
              }
            </div>
          } @else {
            <div
              class="animate-fade-in flex flex-col items-center justify-center py-20 text-center border border-dashed border-surface rounded-2xl bg-surface-card/30"
            >
              <p class="text-lg font-bold text-muted-color m-0">Aucun résultat pour ce filtre</p>
              <p-button
                label="Voir tous les sondages"
                variant="text"
                size="small"
                styleClass="mt-2"
                (click)="facade.setFilter('all')"
              />
            </div>
          }
        }
      }
    </div>
  `,
})
export class PollListViewComponent {
  protected readonly facade = inject(PollListFacade);
  protected readonly store = inject(AuthStore);

  protected readonly tabsConfig = computed(() => {
    const counts = this.facade.counts();
    const currentFilter = this.facade.filter();

    return POLL_FILTER_CONFIG.map((option) => {
      const value = option.value as keyof typeof counts;
      const count = counts[value] ?? 0;
      const isActive = currentFilter === value;

      let badgeClass =
        'px-1.5 py-0.5 text-[10px] font-black rounded-md font-mono transition-colors ';

      if (isActive) {
        badgeClass += 'bg-primary text-primary-contrast';
      } else {
        const themeMap: Record<string, ThemeColor> = {
          active: 'success',
          closed: 'danger',
          pending: 'warning',
          all: 'neutral',
        };
        const theme = themeMap[value] || 'neutral';
        badgeClass += this.getBadgeThemeClass(theme);
      }

      return { ...option, count, badgeClass };
    });
  });

  private getBadgeThemeClass(theme: ThemeColor): string {
    switch (theme) {
      case 'success':
        return 'bg-emerald-50 text-emerald-600';
      case 'danger':
        return 'bg-red-50 text-red-600';
      case 'warning':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  }
}
