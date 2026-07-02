import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PollCreateFacade } from '../facade/poll-create.facade';

@Component({
  selector: 'app-poll-create-view',
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <div class="max-w-xl mx-auto py-8 md:py-12 font-sans box-border animate-fade-in">
      <button
        (click)="facade.goBack()"
        class="inline-flex items-center gap-2 text-sm font-semibold text-muted-color hover:text-color transition-colors mb-6 bg-transparent border-none cursor-pointer p-0"
      >
        <i class="pi pi-arrow-left text-xs"></i> Retour
      </button>

      <h1 class="text-2xl font-black text-color tracking-tight mb-8 mt-0">
        Créer un nouveau sondage
      </h1>

      <form (ngSubmit)="facade.submit()" class="flex flex-col gap-6">
        <div>
          <div class="flex items-end justify-between mb-2">
            <label for="title" class="block text-sm font-bold text-color">
              Titre <span class="text-red-500">*</span>
            </label>
            <span
              class="text-xs font-mono font-medium"
              [ngClass]="facade.title().length > 120 ? 'text-red-500' : 'text-muted-color'"
            >
              {{ facade.title().length }}/120
            </span>
          </div>
          <input
            id="title"
            type="text"
            [ngModel]="facade.title()"
            (ngModelChange)="facade.title.set($event)"
            name="title"
            maxlength="120"
            placeholder="Ex: Quel framework préférez-vous ?"
            class="w-full rounded-xl border px-4 py-3 text-sm bg-surface-card text-color placeholder:text-muted-color/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors box-border"
            [ngClass]="facade.errors()['title'] ? 'border-red-500 bg-red-50/10' : 'border-surface'"
          />
          @if (facade.errors()['title']) {
            <p class="mt-1.5 text-xs font-bold text-red-500 m-0">{{ facade.errors()['title'] }}</p>
          }
        </div>

        <div>
          <label class="block text-sm font-bold text-color mb-2">
            Options <span class="text-red-500">*</span>
            <span class="text-muted-color font-medium text-xs">(minimum 2)</span>
          </label>
          <div class="flex flex-col gap-3">
            @for (option of facade.options(); track $index) {
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  [ngModel]="option"
                  (ngModelChange)="facade.updateOption($index, $event)"
                  [name]="'option-' + $index"
                  [placeholder]="'Option ' + ($index + 1)"
                  class="flex-1 rounded-xl border border-surface px-4 py-3 text-sm bg-surface-card text-color placeholder:text-muted-color/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors box-border"
                />
                @if (facade.options().length > 2) {
                  <button
                    type="button"
                    (click)="facade.removeOption($index)"
                    class="flex items-center justify-center rounded-xl w-11 h-11 text-muted-color hover:text-red-500 hover:bg-red-50/50 transition-colors border-none bg-transparent cursor-pointer shrink-0"
                    title="Supprimer l'option"
                  >
                    <i class="pi pi-trash text-sm"></i>
                  </button>
                }
              </div>
            }
          </div>

          @if (facade.errors()['options']) {
            <p class="mt-1.5 text-xs font-bold text-red-500 m-0">
              {{ facade.errors()['options'] }}
            </p>
          }

          @if (facade.options().length < 10) {
            <button
              type="button"
              (click)="facade.addOption()"
              class="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all border-none bg-transparent cursor-pointer p-0"
            >
              <i class="pi pi-plus text-xs"></i> Ajouter une option
            </button>
          }
        </div>

        <div>
          <label for="expiresAt" class="block text-sm font-bold text-color mb-2">
            Date de fin <span class="text-red-500">*</span>
          </label>
          <input
            id="expiresAt"
            type="datetime-local"
            [ngModel]="facade.expiresAt()"
            (ngModelChange)="facade.expiresAt.set($event)"
            name="expiresAt"
            class="w-full rounded-xl border px-4 py-3 text-sm bg-surface-card text-color focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors box-border"
            [ngClass]="
              facade.errors()['expiresAt'] ? 'border-red-500 bg-red-50/10' : 'border-surface'
            "
          />
          @if (facade.errors()['expiresAt']) {
            <p class="mt-1.5 text-xs font-bold text-red-500 m-0">
              {{ facade.errors()['expiresAt'] }}
            </p>
          }
        </div>

        <label
          class="flex items-start gap-3 cursor-pointer rounded-xl border border-surface p-4 hover:bg-surface-hover/30 transition-colors box-border group"
        >
          <input
            type="checkbox"
            [ngModel]="facade.showResults()"
            (ngModelChange)="facade.showResults.set($event)"
            name="showResults"
            class="mt-0.5 h-4 w-4 rounded border-surface text-primary accent-primary cursor-pointer shrink-0"
          />
          <div class="flex flex-col">
            <span class="font-bold text-sm text-color group-hover:text-primary transition-colors"
              >Afficher les résultats partiels</span
            >
            <span class="text-xs text-muted-color font-medium mt-0.5"
              >Les participants pourront voir les tendances avant la clôture officielle.</span
            >
          </div>
        </label>

        <div class="rounded-xl border border-surface bg-surface-card/50 p-4 box-border">
          <div class="flex items-center gap-2 text-sm font-bold text-color">
            <i class="pi pi-info-circle text-primary"></i> Quota de sondages actifs
          </div>

          <div class="mt-3 flex items-center justify-between text-xs font-medium">
            <span class="text-muted-color">Maximum 10 simultanément</span>
            <span
              class="font-bold font-mono tracking-wide"
              [ngClass]="facade.activePollsCount() >= 10 ? 'text-red-500' : 'text-color'"
            >
              {{ facade.activePollsCount() }}/10
            </span>
          </div>

          <div class="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              class="h-full rounded-full transition-all duration-500 ease-out"
              [ngClass]="
                facade.activePollsCount() >= 10
                  ? 'bg-red-500'
                  : facade.activePollsCount() >= 8
                    ? 'bg-orange-500'
                    : 'bg-primary'
              "
              [style.width.%]="(facade.activePollsCount() / 10) * 100"
            ></div>
          </div>

          @if (facade.errors()['limit']) {
            <p class="mt-3 mb-0 text-xs text-red-500 font-bold">{{ facade.errors()['limit'] }}</p>
          }
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-surface mt-2">
          <p-button
            label="Annuler"
            variant="text"
            severity="secondary"
            (click)="facade.goBack()"
            styleClass="text-sm font-bold px-4"
          />
          <p-button
            type="submit"
            label="Créer le sondage"
            icon="pi pi-check"
            severity="primary"
            [loading]="facade.isSubmitting()"
            styleClass="text-sm font-bold px-6 shadow-sm"
          />
        </div>
      </form>
    </div>
  `,
})
export class PollCreateViewComponent {
  protected readonly facade = inject(PollCreateFacade);
}
