import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AnalyticsFacade } from '../facade/analytics.facade';

@Component({
  selector: 'app-analytics-view',
  imports: [CommonModule, ToastModule, RouterLink],
  providers: [MessageService],
  template: `
    <div class="container py-8 mx-auto max-w-300">
      <p-toast></p-toast>

      @let currentState = facade.state();

      @switch (currentState.type) {
        @case ('LOADING') {
          <div class="text-center py-20 text-gray-500 text-sm animate-pulse">
            <i class="pi pi-spin pi-spinner text-2xl text-primary mb-3"></i>
            <p class="m-0 font-medium">Chargement du tableau de bord...</p>
          </div>
        }

        @case ('ERROR') {
          <div class="p-4 rounded-md bg-red-50 text-red-600 border border-red-100 text-sm">
            {{ currentState.message }}
          </div>
        }

        @case ('SUCCESS') {
          <a
            [routerLink]="['/admin/dashboard']"
            class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 no-underline cursor-pointer"
          >
            <i class="pi pi-arrow-left text-xs"></i>
            Retour au dashboard
          </a>

          <div class="flex items-center justify-between mb-8 animate-fade-in">
            <h1 class="text-2xl font-bold text-gray-900 m-0">Analytics & Exports</h1>
            <button
              (click)="facade.triggerExport()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <i class="pi pi-download"></i> Exporter
            </button>
          </div>

          <div class="grid gap-4 sm:grid-cols-3 mb-8">
            @for (kpi of facade.kpis(); track kpi.label) {
              <div
                class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in-up"
                [style.animation-delay]="$index * 100 + 'ms'"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-500">{{ kpi.label }}</span>
                  <i [class]="kpi.icon + ' text-primary text-xl'"></i>
                </div>
                <p class="text-3xl font-extrabold text-gray-900 m-0">{{ kpi.value }}</p>
                <p class="text-xs font-medium text-green-600 m-0 mt-1.5 flex items-center gap-1">
                  <i class="pi pi-arrow-up text-[10px]"></i> {{ kpi.trend }} vs semaine dernière
                </p>
              </div>
            }
          </div>

          <div
            class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-8 animate-fade-in"
          >
            <h2 class="text-lg font-semibold text-gray-900 m-0 mb-8">
              Votes par jour (7 derniers jours)
            </h2>

            <div class="flex items-end gap-3 h-48">
              @for (d of facade.weeklyDataView(); track d.day) {
                <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span
                    class="text-xs font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity mb-1"
                    >{{ d.votes }}</span
                  >

                  <div
                    class="w-full max-w-12 bg-primary/80 rounded-t-md transition-all duration-1000 ease-out hover:bg-primary"
                    [ngStyle]="{
                      height: showBars() ? d.heightPercentage + '%' : '0%',
                    }"
                  ></div>

                  <span class="text-xs font-medium text-gray-500 mt-2">{{ d.day }}</span>
                </div>
              }
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
            <h2 class="text-lg font-semibold text-gray-900 m-0 mb-6">Activité récente</h2>
            <div class="space-y-6">
              @for (log of facade.activityLogs(); track log.action) {
                <div class="flex items-start gap-4">
                  <div
                    class="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0 ring-4 ring-primary/10"
                  ></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 m-0">{{ log.action }}</p>
                    <p class="text-xs text-gray-500 m-0 mt-1">
                      par <span class="font-medium">&#64;{{ log.user }}</span> &middot;
                      {{ log.time }}
                    </p>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.4s ease-out forwards;
        opacity: 0;
      }
      .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
        animation-delay: 0.3s;
        opacity: 0;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AnalyticsViewComponent implements OnInit {
  protected readonly facade = inject(AnalyticsFacade);
  public readonly showBars = signal(false);

  ngOnInit(): void {
    // Déclenchement de l'animation de croissance des barres après rendu des données
    setTimeout(() => {
      this.showBars.set(true);
    }, 250);
  }
}
