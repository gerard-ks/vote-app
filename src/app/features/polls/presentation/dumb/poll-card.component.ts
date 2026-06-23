import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Poll } from '@features/polls/domain/poll.entity';
import { AuthStore } from '@store/auth/auth.store';

@Component({
  selector: 'app-poll-card',
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  template: `
    <div class="animate-fade-in opacity-0" [style.animation-delay]="computedDelay()">
      <p-card
        class="h-56 flex flex-col justify-between border border-surface bg-surface-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer group"
        [routerLink]="pollDetailUrl()"
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
              [ngClass]="statusBadgeClass()"
            >
              {{
                poll().status === 'closed'
                  ? 'Clos'
                  : poll().status === 'active'
                    ? 'Actif'
                    : 'En attente'
              }}
            </span>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <div
            class="my-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-color font-medium font-sans"
          >
            @if (poll().status === 'active') {
              <span class="inline-flex items-center gap-1.5">
                <i class="pi pi-clock"></i>
                {{
                  daysLeft() > 0
                    ? 'Expire dans ' + daysLeft() + ' jour' + (daysLeft() > 1 ? 's' : '')
                    : "Expire aujourd'hui"
                }}
              </span>
            }
            @if (poll().status === 'closed') {
              <span class="inline-flex items-center gap-1.5">
                <i class="pi pi-clock"></i>
                Clos le {{ formattedCloseDate() }}
              </span>
            }
            @if (poll().status === 'pending') {
              <span class="inline-flex items-center gap-1.5">
                <i class="pi pi-calendar-clock"></i>
                Démarre bientôt
              </span>
            }

            <span class="inline-flex items-center gap-1.5">
              <i class="pi pi-users"></i>
              {{ poll().totalVotes }} vote{{ poll().totalVotes !== 1 ? 's' : '' }}
            </span>
          </div>

          @if (poll().status === 'closed' && leader()) {
            <div
              class="mt-3 flex items-center gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 text-xs font-sans"
            >
              <i class="pi pi-trophy text-emerald-600 shrink-0"></i>
              <span class="text-color font-medium truncate max-w-35">{{ leader()!.text }}</span>
              <span class="ml-auto text-emerald-600 font-bold font-mono"
                >{{ leaderPercentage() }}%</span
              >
            </div>
          }
        </ng-template>

        <ng-template pTemplate="footer">
          <div
            class="pt-2 border-t border-surface flex items-center text-xs font-bold text-primary group-hover:underline font-sans"
          >
            {{ poll().status === 'active' ? 'Voter →' : 'Voir les détails →' }}
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
})
export class PollCardComponent {
  public readonly poll = input.required<Poll>();
  public readonly index = input<number>(0);

  protected readonly store = inject(AuthStore);

  protected readonly pollDetailUrl = computed(() => {
    return this.store.isAuthenticated()
      ? ['/member', 'sondage', this.poll().id]
      : ['/sondage', this.poll().id];
  });

  protected readonly computedDelay = computed(() => {
    return `${this.index() * 0.05}s`;
  });

  protected readonly daysLeft = computed(() => {
    const expireTime = new Date(this.poll().expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24)));
  });

  protected readonly formattedCloseDate = computed(() => {
    return new Date(this.poll().expiresAt).toLocaleDateString('fr-FR');
  });

  protected readonly leader = computed(() => {
    const options = this.poll().options;
    if (!options || options.length === 0) return null;
    return [...options].sort((a, b) => b.votes - a.votes)[0];
  });

  protected readonly leaderPercentage = computed(() => {
    const topOption = this.leader();
    const total = this.poll().totalVotes;
    if (!topOption || total === 0) return 0;
    return Math.round((topOption.votes / total) * 100);
  });

  protected readonly statusBadgeClass = computed(() => {
    const status = this.poll().status;
    if (status === 'active') return 'bg-emerald-50 text-emerald-600 border border-emerald-200/30';
    if (status === 'closed') return 'bg-red-50 text-red-600 border border-red-200/30';
    return 'bg-orange-50 text-orange-600 border border-orange-200/30';
  });
}
