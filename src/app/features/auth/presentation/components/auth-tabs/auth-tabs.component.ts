import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-auth-tabs',
  template: `
    <div
      class="inline-flex w-full rounded-xl border border-surface bg-surface-variant p-1 mb-6 box-border font-sans"
    >
      <button
        type="button"
        (click)="onModeChange.emit('login')"
        [class]="
          currentMode() === 'login'
            ? 'bg-surface text-color shadow-sm border-surface'
            : 'text-muted-color hover:text-color'
        "
        class="flex-1 text-center py-1.5 text-sm font-bold bg-transparent border border-transparent rounded-lg transition-colors cursor-pointer"
      >
        Connexion
      </button>
      <button
        type="button"
        (click)="onModeChange.emit('register')"
        [class]="
          currentMode() === 'register'
            ? 'bg-surface text-color shadow-sm border-surface'
            : 'text-muted-color hover:text-color'
        "
        class="flex-1 text-center py-1.5 text-sm font-bold bg-transparent border border-transparent rounded-lg transition-colors cursor-pointer"
      >
        Inscription
      </button>
    </div>
  `,
})
export class AuthTabsComponent {
  public readonly currentMode = input.required<'login' | 'register'>();
  public readonly onModeChange = output<'login' | 'register'>();
}
