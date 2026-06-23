import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-surface bg-surface-card py-8 mt-auto box-border shrink-0">
      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-color px-6 md:px-12 box-border"
      >
        <p>© {{ currentYear() }} Votes — Plateforme de sondages</p>

        <div class="flex items-center gap-6">
          <a
            href="#"
            class="text-muted-color hover:text-color no-underline transition-colors duration-150"
            >CGU</a
          >
          <a
            href="#"
            class="text-muted-color hover:text-color no-underline transition-colors duration-150"
            >Confidentialité</a
          >
          <span class="text-xs opacity-70">v1.0.0-poc</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly currentYear = signal<number>(new Date().getFullYear());
}
