import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '@features/auth/presentation/facade/auth.facade';
import { BrandPanelComponent } from '@features/auth/presentation/components/brand-panel/brand-panel.component';
import { AuthTabsComponent } from '@features/auth/presentation/components/auth-tabs/auth-tabs.component';
import { DEMO_ACCOUNTS } from '@features/auth/presentation/constants/auth.constants';


@Component({
  selector: 'app-auth-box',
  providers: [AuthFacade],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    BrandPanelComponent,
    AuthTabsComponent,
  ],
  template: `
    <div
      class="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full font-sans box-border bg-surface text-color"
    >
      <!-- Panneau d'identité à gauche (Fidèle à vos captures) -->
      <app-brand-panel></app-brand-panel>

      <!-- PANNEAU DROIT RECALIBRÉ : Utilise flex-col et h-full pour isoler l'en-tête et le formulaire -->
      <div
        class="flex flex-col min-h-screen lg:h-full w-full box-border px-6 py-8 sm:px-12 lg:px-16 justify-between"
      >
        <!-- A. BANDEAU SUPÉRIEUR ISOLE : Reste calé au pixel près en haut de l'écran -->
        <div class="flex items-center justify-between w-full shrink-0">
          <a
            routerLink="/"
            class="inline-flex items-center gap-1.5 text-sm text-muted-color hover:text-color no-underline font-semibold transition-colors"
          >
            <i class="pi pi-arrow-left text-xs"></i> Retour aux sondages
          </a>
          <a
            routerLink="/"
            class="lg:hidden inline-flex items-center gap-2 font-bold text-primary no-underline text-sm"
          >
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-contrast shadow-sm"
            >
              <i class="pi pi-chart-bar text-[10px]"></i>
            </span>
            <span class="font-black tracking-tight">Votes</span>
          </a>
        </div>

        <!-- B. CONTENEUR CENTRAL : Centre verticalement et horizontalement le bloc du formulaire -->
        <div class="flex flex-1 items-center justify-center w-full my-8 lg:my-0">
          <div class="animate-fade-in w-full max-w-sm box-border">
            <!-- Appel épuré du composant Dumb d'onglets -->
            <app-auth-tabs
              [currentMode]="mode()"
              (onModeChange)="handleModeToggle($event)"
            ></app-auth-tabs>

            <h1 class="text-2xl font-black tracking-tight text-color m-0 mb-1.5">
              {{ mode() === 'login' ? 'Bon retour !' : 'Créer un compte' }}
            </h1>

            <p class="text-sm text-muted-color font-medium m-0 mb-6">
              {{
                mode() === 'login'
                  ? 'Connectez-vous pour participer et créer des sondages.'
                  : 'Quelques infos suffisent pour démarrer.'
              }}
            </p>

            <form
              [formGroup]="authForm"
              (ngSubmit)="onSubmit()"
              class="flex flex-col gap-4 w-full box-border"
            >
              @if (mode() === 'register') {
                <div class="flex flex-col gap-1.5 w-full">
                  <label class="text-xs font-bold text-color">Nom</label>
                  <input
                    pInputText
                    formControlName="name"
                    placeholder="Votre nom"
                    class="w-full text-sm font-medium p-2.5 rounded-lg"
                  />
                </div>

                <div class="flex flex-col gap-1.5 w-full">
                  <label class="text-xs font-bold text-color">Je veux principalement…</label>

                  <div class="grid grid-cols-2 gap-3 w-full">
                    <button
                      type="button"
                      (click)="toggleRole('participant')"
                      [class]="
                        facade.signupRole() === 'participant'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-surface bg-surface-card hover:border-primary/40'
                      "
                      class="flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all cursor-pointer box-border"
                    >
                      <span class="text-sm font-bold text-color">🗳️ Voter</span>
                      <span class="text-[10px] text-muted-color font-medium leading-tight"
                        >Participer aux sondages</span
                      >
                    </button>

                    <button
                      type="button"
                      (click)="toggleRole('creator')"
                      [class]="
                        facade.signupRole() === 'creator'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-surface bg-surface-card hover:border-primary/40'
                      "
                      class="flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all cursor-pointer box-border"
                    >
                      <span class="text-sm font-bold text-color">✍️ Créer</span>
                      <span class="text-[10px] text-muted-color font-medium leading-tight"
                        >Lancer mes sondages</span
                      >
                    </button>
                  </div>

                  <p class="text-[11px] text-muted-color font-medium m-0 mt-1.5 leading-tight">
                    Vous pourrez toujours voter sur les sondages, quel que soit votre choix.
                  </p>
                </div>
              }

              <div class="flex flex-col gap-1.5 w-full">
                <label class="text-xs font-bold text-color">Email</label>
                <input
                  pInputText
                  type="email"
                  formControlName="email"
                  placeholder="vous&#64;exemple.com"
                  class="w-full text-sm font-medium p-2.5 rounded-lg"
                />
              </div>

              <div class="flex flex-col gap-1.5 w-full">
                <label class="text-xs font-bold text-color">Mot de passe</label>
                <p-password
                  formControlName="password"
                  [toggleMask]="true"
                  [feedback]="false"
                  placeholder="••••••••"
                  class="w-full"
                  inputStyleClass="w-full text-sm font-medium p-2.5 rounded-lg"
                />
              </div>

              @if (mode() === 'login') {
                <div class="flex justify-end w-full">
                  <button
                    type="button"
                    class="text-xs font-semibold text-muted-color hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              }

              <p-button
                type="submit"
                [label]="mode() === 'login' ? 'Se connecter' : 'Créer mon compte'"
                severity="primary"
                styleClass="w-full font-bold text-sm py-2.5 rounded-lg shadow-sm mt-2"
                [disabled]="authForm.invalid || facade.state().type === 'LOADING'"
                [loading]="facade.state().type === 'LOADING'"
              />
            </form>

            @if (mode() === 'login') {
              <div class="mt-6 w-full">
                <div class="relative my-4 flex items-center justify-center">
                  <div class="absolute inset-0 flex items-center w-full">
                    <span class="w-full border-t border-surface"></span>
                  </div>
                  <div
                    class="relative bg-surface px-3 text-[10px] font-black uppercase text-muted-color tracking-wider"
                  >
                    Comptes de démo
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2 w-full">
                  @for (demo of demoAccounts; track demo.label) {
                    <button
                      type="button"
                      (click)="injectDemo(demo.email)"
                      class="rounded-xl border border-surface bg-surface-card py-2 text-xs font-bold cursor-pointer hover:bg-surface-hover/30"
                    >
                      <span class="font-semibold text-foreground">{{ demo.label }}</span>
                      <span class="text-[10px] text-muted-color mt-0.5 block">{{ demo.role }}</span>
                    </button>
                  }
                </div>
              </div>
            }

            <p
              class="text-center text-[10px] text-muted-color font-medium leading-normal m-0 mt-8 px-4 box-border shrink-0"
            >
              En continuant, vous acceptez nos
              <button
                type="button"
                class="underline bg-transparent border-none p-0 text-color font-bold cursor-pointer"
              >
                conditions
              </button>
              et notre
              <button
                type="button"
                class="underline bg-transparent border-none p-0 text-color font-bold cursor-pointer"
              >
                politique de confidentialité</button
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthBoxComponent {
  protected readonly facade = inject(AuthFacade);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  public readonly mode = input.required<'login' | 'register'>();

  protected readonly demoAccounts = DEMO_ACCOUNTS;

  protected readonly authForm = this.fb.nonNullable.group({
    name: [''],
    role: ['participant'],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected handleModeToggle(target: 'login' | 'register'): void {
    void this.router.navigate([`/auth/${target}`]);
  }

  protected toggleRole(role: 'participant' | 'creator'): void {
    this.facade.setRole(role);
    this.authForm.patchValue({ role });
  }

  protected injectDemo(email: string): void {
    this.authForm.patchValue({
      email: email.replace('&#64;', '@'),
      password: 'password1234',
    });
  }

  protected onSubmit(): void {
    if (this.authForm.invalid) return;

    // On récupère toutes les valeurs du formulaire proprement
    const formValues = this.authForm.getRawValue();

    if (this.mode() === 'login') {
      // 1. Cas Connexion : On délègue à la façade
      this.facade.login(formValues.email);
    } else {
      // 2. Cas Inscription : On vérifie que le nom n'est pas vide
      if (!formValues.name.trim()) {
        this.authForm.controls.name.setErrors({ required: true });
        return;
      }
      // On délègue à la façade
      this.facade.register(
        formValues.name,
        formValues.email,
        formValues.role as 'participant' | 'creator',
      );
    }
  }
}
