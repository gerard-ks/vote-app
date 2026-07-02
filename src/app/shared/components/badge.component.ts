import { ThemeColor } from '@shared/models/ui.models';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  template: `
    <span
      class="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
      [ngClass]="badgeClasses()"
    >
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  theme = input.required<ThemeColor>();

  badgeClasses(): string {
    switch (this.theme()) {
      case 'success':
        return 'bg-emerald-50 text-emerald-600';
      case 'danger':
        return 'bg-red-50 text-red-600';
      case 'warning':
        return 'bg-orange-50 text-orange-600';
      case 'info':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
