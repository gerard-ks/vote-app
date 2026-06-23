import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { AppTopbarComponent } from '../dashboard/app-topbar.component';
import { FooterComponent } from '../public/footer.component';
import { AppSidebarComponent } from '../dashboard/app-sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppTopbarComponent, FooterComponent, AppSidebarComponent],
  template: `
    <div class="flex h-screen w-full bg-surface text-color font-sans overflow-hidden">
      <app-sidebar [isExpanded]="isExpanded()"></app-sidebar>

      @if (isExpanded()) {
        <div class="fixed inset-0 bg-black/40 z-30 md:hidden" (click)="isExpanded.set(false)"></div>
      }

      <div class="flex-1 flex flex-col h-full overflow-hidden min-w-0 z-20">
        <app-topbar (menuToggled)="isExpanded.set(!isExpanded())"></app-topbar>

        <main class="flex-1 overflow-y-auto p-4 md:p-12 bg-surface-variant/20">
          <div class="max-w-5xl mx-auto w-full">
            <router-outlet></router-outlet>
          </div>
        </main>

        <app-footer></app-footer>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  // Par défaut sur Desktop, le menu est agrandi (true).
  public readonly isExpanded = signal(true);
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        // Optionnel : tu peux choisir de ne fermer automatiquement que sur mobile
        if (window.innerWidth < 768) {
          this.isExpanded.set(false);
        }
      });
  }
}
