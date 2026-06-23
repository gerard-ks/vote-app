import { Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../store/auth/auth.store';

interface NavItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  host: {
    // LE SECRET ABSOLU : Rend la balise <app-sidebar> invisible pour le Flexbox parent.
    // Le <aside> devient un enfant direct du Layout, réglant tous les bugs d'écrasement du footer !
    class: 'contents',
  },
  template: `
    <aside
      [class.w-64]="isExpanded()"
      [class.w-20]="!isExpanded()"
      [class.-translate-x-full]="!isExpanded()"
      [class.translate-x-0]="isExpanded()"
      class="fixed md:static inset-y-0 left-0 z-40 flex flex-col justify-between h-full bg-surface-card border-r border-surface transition-all duration-300 ease-in-out md:translate-x-0 overflow-hidden shrink-0 box-border p-4"
    >
      <div class="flex flex-col gap-6">
        <div
          class="border-b border-surface pb-3 flex items-center"
          [ngClass]="!isExpanded() ? 'justify-center' : ''"
        >
          <a
            [routerLink]="homeUrl()"
            class="flex items-center gap-2 font-bold text-primary no-underline overflow-hidden"
          >
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-contrast shadow-sm shrink-0"
            >
              <i class="pi pi-chart-bar text-xs"></i>
            </span>
            <span
              class="text-base text-primary font-black tracking-tight whitespace-nowrap"
              [class.hidden]="!isExpanded()"
              >Votes</span
            >
          </a>
        </div>

        <div class="flex flex-col gap-5">
          @if (store.isAdmin()) {
            <div class="flex flex-col gap-1.5">
              <div
                class="flex items-center text-muted-color select-none"
                [ngClass]="isExpanded() ? 'px-3 justify-start gap-1.5' : 'justify-center'"
                [title]="!isExpanded() ? 'Backoffice Administrateur' : ''"
              >
                <i class="pi pi-shield text-[11px]"></i>
                <span
                  [class.hidden]="!isExpanded()"
                  class="text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                >
                  Backoffice
                </span>
              </div>
              <nav class="flex flex-col gap-0.5 list-none p-0 m-0 text-sm font-medium">
                @for (item of adminItems; track item.url) {
                  <a
                    [routerLink]="item.url"
                    [routerLinkActiveOptions]="{ exact: item.url === '/dashboard/dashboard' }"
                    routerLinkActive="bg-surface-variant text-color font-semibold border-surface"
                    class="flex items-center rounded-xl text-muted-color hover:text-color hover:bg-surface-hover/30 no-underline transition-colors border border-transparent overflow-hidden"
                    [ngClass]="isExpanded() ? 'gap-2.5 px-3 py-2' : 'justify-center py-3'"
                  >
                    <i [class]="item.icon + ' text-lg shrink-0'"></i>
                    <span class="whitespace-nowrap" [class.hidden]="!isExpanded()">{{
                      item.title
                    }}</span>
                  </a>
                }
              </nav>
            </div>
          }

          @if (!store.isAdmin()) {
            <div class="flex flex-col gap-1.5">
              <span
                [class.hidden]="!isExpanded()"
                class="px-3 text-[10px] font-black uppercase text-muted-color tracking-wider select-none whitespace-nowrap"
                >Navigation</span
              >
              <nav class="flex flex-col gap-0.5 list-none p-0 m-0 text-sm font-medium">
                <a
                  [routerLink]="browseUrl()"
                  [routerLinkActiveOptions]="{ exact: true }"
                  routerLinkActive="bg-surface-variant text-color font-semibold border-surface"
                  class="flex items-center rounded-xl text-muted-color hover:text-color hover:bg-surface-hover/30 no-underline transition-colors border border-transparent overflow-hidden"
                  [ngClass]="isExpanded() ? 'gap-2.5 px-3 py-2' : 'justify-center py-3'"
                >
                  <i [class]="browseItem.icon + ' text-lg shrink-0'"></i>
                  <span class="whitespace-nowrap" [class.hidden]="!isExpanded()">{{
                    browseItem.title
                  }}</span>
                </a>

                @if (showMyVotes()) {
                  <a
                    [routerLink]="myVotesItem.url"
                    routerLinkActive="bg-surface-variant text-color font-semibold border-surface"
                    class="flex items-center rounded-xl text-muted-color hover:text-color hover:bg-surface-hover/30 no-underline transition-colors border border-transparent overflow-hidden"
                    [ngClass]="isExpanded() ? 'gap-2.5 px-3 py-2' : 'justify-center py-3'"
                  >
                    <i [class]="myVotesItem.icon + ' text-lg shrink-0'"></i>
                    <span class="whitespace-nowrap" [class.hidden]="!isExpanded()">{{
                      myVotesItem.title
                    }}</span>
                  </a>
                }
              </nav>
            </div>
          }
        </div>
      </div>

      <div class="flex flex-col gap-4 overflow-hidden">
        @if (store.isAuthenticated()) {
          <div class="border-t border-surface pt-3 flex flex-col gap-2.5">
            @if (isExpanded()) {
              <div class="flex flex-col px-1">
                <span class="text-xs font-black text-color truncate">{{
                  store.session()?.name
                }}</span>
                <span
                  class="text-[9px] font-black uppercase text-muted-color tracking-wide mt-0.5 font-mono"
                  >Rôle : {{ store.session()?.role }}</span
                >
              </div>
            }
            <p-button
              [label]="isExpanded() ? 'Déconnexion' : ''"
              icon="pi pi-sign-out"
              variant="text"
              severity="danger"
              [styleClass]="
                isExpanded()
                  ? 'w-full text-xs font-bold p-2 justify-start rounded-xl'
                  : 'w-10 h-10 p-0 mx-auto justify-center rounded-xl'
              "
              (click)="handleLogout()"
            />
          </div>
        }
      </div>
    </aside>
  `,
})
export class AppSidebarComponent {
  // Le signal reçu depuis le layout : Vrai = Ouvert/Large (256px), Faux = Fermé/Icones (80px)
  public readonly isExpanded = input.required<boolean>();

  protected readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly browseItem: NavItem = { title: 'Sondages', url: '/', icon: 'pi pi-home' };
  protected readonly myVotesItem: NavItem = {
    title: 'Mes Votes',
    url: '/member/mes-votes',
    icon: 'pi pi-check-square',
  };
  protected readonly adminItems: NavItem[] = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: 'pi pi-chart-line' },
    { title: 'Utilisateurs', url: '/admin/users', icon: 'pi pi-users' },
    { title: 'Modération', url: '/admin/polls', icon: 'pi pi-list-check' },
    { title: 'Analytics', url: '/admin/analytics', icon: 'pi pi-chart-bar' },
  ];

  protected readonly browseUrl = computed(() => (this.store.isAuthenticated() ? '/member' : '/'));
  protected readonly homeUrl = computed(() => {
    if (this.store.isAdmin()) return '/admin/dashboard';
    if (this.store.isAuthenticated()) return '/member';
    return '/';
  });
  protected readonly showMyVotes = computed(
    () => this.store.isAuthenticated() && !this.store.isAdmin(),
  );

  protected handleLogout(): void {
    this.store.clearSession();
    void this.router.navigate(['/']);
  }
}
