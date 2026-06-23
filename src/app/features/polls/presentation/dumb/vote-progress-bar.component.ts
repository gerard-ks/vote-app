import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-vote-progress-bar',
  imports: [CommonModule, ProgressBarModule],
  template: `
    <div class="w-full font-sans text-sm space-y-1.5 box-border">
      <!-- Section En-tête des scores -->
      <div class="flex items-center justify-between gap-3 text-sm">
        <span
          [ngClass]="isLeader() ? 'text-color font-semibold' : 'text-muted-color/90 font-medium'"
          class="truncate inline-flex items-center"
        >
          {{ label() }}

          @if (isLeader()) {
            <span
              class="ml-2 inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide select-none"
            >
              EN TÊTE
            </span>
          }
        </span>

        <span class="shrink-0 font-mono text-xs text-muted-color">
          <span class="mr-2">{{ votes() }} vote{{ votes() !== 1 ? 's' : '' }}</span>
          <span
            [ngClass]="isLeader() ? 'text-color font-bold' : 'text-muted-color'"
            class="font-sans"
            >{{ formattedPercentage() }}%</span
          >
        </span>
      </div>

      <!-- Le fond de la jauge extérieure utilise bg-surface-200 (le gris clair de la maquette).
           La jauge interne utilise bg-emerald-500 pour le leader, et bg-slate-300 pour les autres options. -->
      <p-progressbar
        [value]="percentage()"
        [showValue]="false"
        class="h-3 rounded-full block w-full bg-surface-200 overflow-hidden"
        [valueStyleClass]="
          isLeader() ? 'bg-emerald-500 animate-grow-bar' : 'bg-slate-300 animate-grow-bar'
        "
      ></p-progressbar>
    </div>
  `,
})
export class VoteProgressBarComponent {
  public readonly label = input.required<string>();
  public readonly votes = input.required<number>();
  public readonly percentage = input.required<number>();
  public readonly isLeader = input.required<boolean>();

  protected readonly formattedPercentage = computed(() => this.percentage().toFixed(1));
}
