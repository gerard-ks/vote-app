import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonModule],
  template: `
    <header
      class="w-full border-b border-surface bg-surface/80 backdrop-blur-md box-border h-14 flex items-center"
    >
      <div
        class="max-w-7xl w-full mx-auto flex items-center justify-between gap-4 px-6 md:px-12 box-border"
      >
        <a
          routerLink="/"
          class="flex items-center gap-2 font-bold text-primary no-underline shrink-0"
        >
          <span
            class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-contrast shadow-sm"
          >
            <i class="pi pi-chart-bar text-xs"></i>
          </span>
          <span class="text-base text-primary tracking-tight">Votes</span>
        </a>

        <div class="flex items-center gap-1.5">
          <p-button
            label="Se connecter"
            variant="text"
            severity="secondary"
            size="small"
            routerLink="/auth/login"
            styleClass="text-sm font-medium"
          />
          <p-button
            label="S'inscrire"
            severity="primary"
            size="small"
            routerLink="/auth/login"
            styleClass="text-sm font-bold shadow-sm"
          />
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
