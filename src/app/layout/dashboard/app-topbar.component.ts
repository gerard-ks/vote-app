import { Component, inject, computed, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '@store/auth/auth.store';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, ButtonModule],
  template: `
    <header
      class="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-surface bg-surface/80 px-4 backdrop-blur-md font-sans box-border w-full"
    >
      <div class="flex items-center gap-2 min-w-0">
        <p-button
          icon="pi pi-bars"
          variant="text"
          severity="secondary"
          styleClass="w-8 h-8 md:hidden"
          (click)="menuToggled.emit()"
        />

        <div class="hidden sm:block h-4 w-px bg-surface-variant mx-1"></div>

        <h1 class="hidden sm:block text-sm font-semibold text-color truncate m-0 select-none">
          {{ currentTitle() }}
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative flex items-center">
          @if (store.isAuthenticated() && store.session(); as user) {
            <button
              type="button"
              (click)="isProfileMenuOpen.set(!isProfileMenuOpen())"
              class="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-semibold text-color hover:bg-surface-hover/30 transition-colors border-none bg-transparent cursor-pointer h-9 relative z-50"
            >
              <div
                class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-contrast shadow-sm font-mono"
              >
                {{ user.name[0].toUpperCase() }}
              </div>
              <span class="hidden sm:inline font-sans text-xs">{{ user.name }}</span>

              @if (store.isAdmin()) {
                <span
                  class="hidden md:inline text-[9px] font-black uppercase tracking-wide bg-red-50 text-red-600 border border-red-200/30 px-1.5 py-0.5 rounded-md font-mono"
                >
                  ADMIN
                </span>
              }
              <i class="pi pi-chevron-down text-[10px] text-muted-color"></i>
            </button>

            @if (isProfileMenuOpen()) {
              <div class="fixed inset-0 z-40" (click)="isProfileMenuOpen.set(false)"></div>

              <div
                class="absolute right-0 top-full mt-1 w-60 rounded-xl border border-surface bg-surface-card shadow-xl flex flex-col p-1 z-50 animate-fade-in origin-top-right box-border"
              >
                <div
                  class="px-3 py-2.5 border-b border-surface flex flex-col font-sans select-none box-border mb-1"
                >
                  <p class="text-sm font-bold text-color m-0 truncate">{{ user.name }}</p>
                  <p class="text-xs text-muted-color m-0 truncate font-medium mt-0.5">
                    {{ user.email }}
                  </p>
                  <div class="mt-2">
                    <span
                      [ngClass]="{
                        'bg-red-50 text-red-600 border-red-200/30': store.isAdmin(),
                        'bg-indigo-50 text-indigo-600 border-indigo-200/30': store.isCreator(),
                        'bg-emerald-50 text-emerald-600 border-emerald-200/30':
                          store.isParticipant(),
                      }"
                      class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-mono border"
                    >
                      {{ user.role }}
                    </span>
                  </div>
                </div>

                @if (!store.isAdmin()) {
                  <button
                    type="button"
                    (click)="navigateTo('/member/mes-votes')"
                    class="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-muted-color hover:text-color hover:bg-surface-hover/50 rounded-lg transition-colors border-none bg-transparent cursor-pointer text-left"
                  >
                    <i class="pi pi-check-square"></i> Mes Votes
                  </button>
                }

                <button
                  type="button"
                  (click)="handleLogout()"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer text-left mt-0.5"
                >
                  <i class="pi pi-sign-out"></i> Déconnexion
                </button>
              </div>
            }
          }
        </div>
      </div>
    </header>
  `,
})
export class AppTopbarComponent {
  protected readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  public readonly menuToggled = output<void>();

  // Le nouveau signal qui gère l'état du profil sans utiliser de librairie externe
  public readonly isProfileMenuOpen = signal(false);

  private readonly routeTitles: Record<string, string> = {
    '/': 'Sondages',
    '/member': 'Sondages',
    '/member/mes-votes': 'Mes Votes',
    '/member/create': 'Créer un sondage',
    '/admin/dashboard': 'Dashboard admin',
    '/admin/users': 'Utilisateurs',
    '/admin/polls': 'Modération',
    '/admin/analytics': 'Analytics',
  };

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  protected readonly currentTitle = computed(() => {
    const url = this.currentUrl();
    return this.routeTitles[url] || '';
  });

  // Méthode propre pour naviguer et fermer le menu d'un coup
  protected navigateTo(path: string): void {
    this.isProfileMenuOpen.set(false);
    void this.router.navigate([path]);
  }

  // Méthode propre pour déconnecter
  protected handleLogout(): void {
    this.isProfileMenuOpen.set(false);
    this.store.clearSession();
    void this.router.navigate(['/']);
  }
}
