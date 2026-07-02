import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PollCardView } from './poll-card.ui-model';

@Component({
  selector: 'app-poll-card',
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  template: `
    <div class="animate-fade-in opacity-0" [style.animation-delay]="computedDelay()">
      <p-card
        class="h-56 flex flex-col justify-between border border-surface bg-surface-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer group"
        [routerLink]="poll().detailUrl"
      >
        <ng-template pTemplate="title">
          <div class="flex justify-between items-start gap-3 w-full">
            <h3
              class="text-sm font-semibold text-color m-0 leading-snug line-clamp-2 h-10 font-sans group-hover:text-primary transition-colors"
            >
              {{ poll().title }}
            </h3>
            <span
              class="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
              [ngClass]="poll().statusBadgeClass"
            >
              {{ poll().statusText }}
            </span>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <div
            class="my-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-color font-medium font-sans"
          >
            <span class="inline-flex items-center gap-1.5">
              <i class="pi" [ngClass]="poll().metaIcon"></i>
              {{ poll().metaText }}
            </span>

            <span class="inline-flex items-center gap-1.5">
              <i class="pi pi-users"></i>
              {{ poll().votesText }}
            </span>
          </div>

          @if (poll().leader) {
            <div
              class="mt-3 flex items-center gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 text-xs font-sans"
            >
              <i class="pi pi-trophy text-emerald-600 shrink-0"></i>
              <span class="text-color font-medium truncate max-w-35">{{
                poll().leader!.text
              }}</span>
              <span class="ml-auto text-emerald-600 font-bold font-mono"
                >{{ poll().leader!.percentage }}%</span
              >
            </div>
          }
        </ng-template>

        <ng-template pTemplate="footer">
          <div
            class="pt-2 border-t border-surface flex items-center text-xs font-bold text-primary group-hover:underline font-sans"
          >
            {{ poll().actionText }}
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
})
export class PollCardComponent {
  public readonly poll = input.required<PollCardView>();
  public readonly index = input<number>(0);

  protected readonly computedDelay = computed(() => {
    return `${this.index() * 0.05}s`;
  });
}
