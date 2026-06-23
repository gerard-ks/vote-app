import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-panel',
  imports: [RouterLink],
  template: `
    <div
      class="hidden lg:flex flex-col justify-between bg-linear-to-br from-primary via-primary to-indigo-700 p-12 text-primary-contrast box-border relative overflow-hidden h-full"
    >
      <div
        class="absolute inset-0 opacity-15 pointer-events-none"
        style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 24px 24px;"
      ></div>

      <div class="relative z-10">
        <a
          routerLink="/"
          class="inline-flex items-center gap-2 font-bold text-xl text-white no-underline"
        >
          <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/15 backdrop-blur-md"
          >
            <i class="pi pi-chart-bar text-sm"></i>
          </span>
          <span>Votes</span>
        </a>
      </div>

      <div class="relative z-10 max-w-md">
        <h2 class="text-3xl font-black text-white leading-tight m-0">
          Créez, votez, décidez —<br />en quelques secondes.
        </h2>
        <p class="mt-4 text-white/80 text-sm font-medium leading-relaxed m-0">
          Une plateforme simple pour lancer des sondages, recueillir des avis et partager les
          résultats avec votre communauté.
        </p>
        <ul class="mt-8 space-y-3 text-sm list-none p-0 m-0 text-white/90 font-semibold">
          <li class="flex items-center gap-3">
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 shadow-sm"
              ><i class="pi pi-sparkles text-xs"></i
            ></span>
            <span>Création en moins d'une minute</span>
          </li>
          <li class="flex items-center gap-3">
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 shadow-sm"
              ><i class="pi pi-users text-xs"></i
            ></span>
            <span>Résultats en temps réel</span>
          </li>
          <li class="flex items-center gap-3">
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 shadow-sm"
              ><i class="pi pi-file-export text-xs"></i
            ></span>
            <span>Export CSV & partage facile</span>
          </li>
        </ul>
      </div>

      <div class="relative z-10 text-xs text-white/60 font-medium font-mono">
        © 2026 Votes — POC
      </div>
    </div>
  `,
})
export class BrandPanelComponent {}
