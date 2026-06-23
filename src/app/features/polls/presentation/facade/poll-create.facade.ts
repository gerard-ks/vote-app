import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../../../../store/auth/auth.store';

@Injectable()
export class PollCreateFacade {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly authStore = inject(AuthStore);
  private readonly messageService = inject(MessageService);

  // ─── ÉTAT LOCAL (Équivalent des useState) ───
  public readonly title = signal<string>('');
  public readonly options = signal<string[]>(['', '']);
  public readonly expiresAt = signal<string>('');
  public readonly showResults = signal<boolean>(false);

  public readonly activePollsCount = signal<number>(7); // Mock
  public readonly isSubmitting = signal<boolean>(false);

  // ─── CYCLE DE VIE (Équivalent du useEffect) ───
  public init(): void {
    const session = this.authStore.session();

    if (!this.authStore.isAuthenticated()) {
      void this.router.navigate(['/auth/login']);
      return;
    }

    // Seuls les créateurs (non dashboard) peuvent créer
    if (!this.authStore.canCreate()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Accès refusé',
        detail: 'Seuls les créateurs peuvent créer un sondage.',
      });
      void this.router.navigate(['/member']);
    }
  }

  // ─── DÉRIVATION RÉACTIVE (Validation à la volée) ───
  public readonly errors = computed(() => {
    const err: Record<string, string> = {};

    if (this.title().trim().length > 0 && this.title().trim().length < 5) {
      err['title'] = 'Le titre doit contenir au moins 5 caractères.';
    }

    const validOptions = this.options().filter((o) => o.trim().length > 0);
    if (this.options().some((o) => o.length > 0) && validOptions.length < 2) {
      err['options'] = 'Au moins 2 options valides sont requises.';
    }

    if (this.expiresAt()) {
      if (new Date(this.expiresAt()) <= new Date()) {
        err['expiresAt'] = 'La date de fin doit être dans le futur.';
      }
    }

    if (this.activePollsCount() >= 10) {
      err['limit'] = 'Vous avez atteint la limite de 10 sondages actifs.';
    }

    return err;
  });

  // ─── MUTATIONS ───
  public addOption(): void {
    if (this.options().length >= 10) return;
    this.options.update((opts) => [...opts, '']);
  }

  public removeOption(index: number): void {
    if (this.options().length <= 2) return;
    this.options.update((opts) => opts.filter((_, i) => i !== index));
  }

  public updateOption(index: number, value: string): void {
    this.options.update((opts) => {
      const newOpts = [...opts];
      newOpts[index] = value;
      return newOpts;
    });
  }

  // ─── SOUMISSION ───
  public submit(): void {
    // Force la validation au clic
    const currentErrors = this.errors();
    const isTitleEmpty = this.title().trim().length === 0;
    const isDateEmpty = this.expiresAt().length === 0;
    const validOptionsCount = this.options().filter((o) => o.trim().length > 0).length;

    if (
      Object.keys(currentErrors).length > 0 ||
      isTitleEmpty ||
      isDateEmpty ||
      validOptionsCount < 2
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulaire invalide',
        detail: 'Veuillez corriger les erreurs avant de soumettre.',
      });
      return;
    }

    if (!this.authStore.session()?.emailVerified) {
      this.messageService.add({
        severity: 'error',
        summary: 'Action requise',
        detail: 'Veuillez vérifier votre email.',
      });
      return;
    }

    this.isSubmitting.set(true);

    // Simulation d'appel API
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sondage créé',
        detail: 'Votre sondage est maintenant en ligne !',
      });
      void this.router.navigate(['/member']);
    }, 800);
  }

  public goBack(): void {
    this.location.back();
  }
}
