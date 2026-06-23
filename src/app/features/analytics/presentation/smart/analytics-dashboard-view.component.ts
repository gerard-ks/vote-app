import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsDashboardFacade } from '../facade/analytics-dashboard.facade';

@Component({
  selector: 'app-analytics-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [AnalyticsDashboardFacade],
  template: `
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-foreground mb-8">Dashboard Admin</h1>

      @let currentState = facade.state();

      @switch (currentState.type) {
        @case ('LOADING') {
          <div class="text-center py-20 text-muted-color text-sm animate-pulse">
            <i class="pi pi-spin pi-spinner text-2xl text-primary mb-3"></i>
            <p class="m-0 font-medium">Chargement du tableau de bord...</p>
          </div>
        }

        @case ('ERROR') {
          <div class="p-6 mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500">
            <div class="flex items-center gap-3 mb-2">
              <i class="pi pi-times-circle text-2xl"></i>
              <h2 class="text-lg font-bold m-0">Oups !</h2>
            </div>
            <p class="m-0 text-sm">{{ facade.errorMessage() }}</p>
          </div>
        }

        @case ('EMPTY') {
          <div
            class="flex flex-col items-center justify-center py-20 text-center rounded-lg border border-dashed border-surface-border"
          >
            <i class="pi pi-inbox text-4xl text-muted-color mb-4"></i>
            <h2 class="text-xl font-bold text-color mb-2">Aucune donnée disponible</h2>
            <p class="text-muted-color max-w-md">
              La plateforme est encore vierge. Dès que de nouveaux utilisateurs s'inscriront ou que
              des sondages seront créés, les indicateurs apparaîtront ici.
            </p>
          </div>
        }

        @case ('SUCCESS') {
          <div class="grid gap-4 sm:grid-cols-3 mb-8">
            @for (stat of facade.metrics(); track stat.label) {
              <div
                class="rounded-lg border border-surface bg-surface-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-muted-color">{{ stat.label }}</span>
                  <i [class]="stat.icon + ' text-xl ' + stat.color"></i>
                </div>
                <p class="text-3xl font-bold text-color tabular-nums">{{ stat.value }}</p>
                <p class="text-xs text-muted-color mt-1 font-medium">
                  <span class="text-green-500">{{ stat.delta }}</span> sur 24h
                </p>
              </div>
            }
          </div>

          <div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6 mb-8">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-color mb-4">
              <i class="pi pi-exclamation-triangle text-yellow-500 text-xl"></i>
              Alertes récentes
            </h2>
            <ul class="space-y-2 m-0 p-0 list-none">
              @for (alert of facade.alerts(); track $index) {
                <li class="flex items-center gap-2 text-sm text-muted-color font-medium">
                  <span class="h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0"></span>
                  {{ alert }}
                </li>
              }
            </ul>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            @for (link of facade.quickLinks; track link.href) {
              <a
                [routerLink]="link.href"
                class="flex items-center justify-between rounded-lg border border-surface bg-surface-card p-4 hover:shadow-md hover:border-primary/50 transition-all group no-underline"
              >
                <div class="flex items-center gap-3">
                  <i [class]="link.icon + ' text-xl text-primary'"></i>
                  <span class="text-sm font-semibold text-color">{{ link.label }}</span>
                </div>
                <i
                  class="pi pi-arrow-right text-sm text-muted-color group-hover:text-primary transition-colors"
                ></i>
              </a>
            }
          </div>
        }
      }
    </div>
  `,
})
export class AnalyticsDashboardViewComponent implements OnInit {
  protected readonly facade = inject(AnalyticsDashboardFacade);

  ngOnInit(): void {
    this.facade.loadDashboard();
  }
}
