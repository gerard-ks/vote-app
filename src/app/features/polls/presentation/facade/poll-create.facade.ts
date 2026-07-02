import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthStore } from '@store/auth/auth.store';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class PollCreateFacade {
  private readonly authStore = inject(AuthStore);
  private readonly messageService = inject(MessageService);
  private readonly repository = inject(PollRepository);
  private readonly destroyRef = inject(DestroyRef);

  // ÉTAT LOCAL
  public readonly title = signal<string>('');
  public readonly options = signal<string[]>(['', '']);
  public readonly expiresAt = signal<string>('');
  public readonly showResults = signal<boolean>(false);

  public readonly activePollsCount = signal<number>(7); // Mock
  public readonly isSubmitting = signal<boolean>(false);

  // DÉRIVATION RÉACTIVE (Validation à la volée)
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

  // ACCÈS (Sécurité métier par callback)
  public checkAccess(onUnauthenticated: () => void, onDenied: () => void): void {
    if (!this.authStore.isAuthenticated()) {
      onUnauthenticated();
      return;
    }

    if (!this.authStore.canCreate()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Accès refusé',
        detail: 'Seuls les créateurs peuvent créer un sondage.',
      });
      onDenied();
    }
  }

  // MUTATIONS
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

  // SOUMISSION (Callback pour la navigation)
  public submit(onSuccess: () => void): void {
    const currentErrors = this.errors();
    const isTitleEmpty = this.title().trim().length === 0;
    const isDateEmpty = this.expiresAt().length === 0;
    const validOptions = this.options().filter((o) => o.trim().length > 0);

    if (
      Object.keys(currentErrors).length > 0 ||
      isTitleEmpty ||
      isDateEmpty ||
      validOptions.length < 2
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulaire invalide',
        detail: 'Veuillez corriger les erreurs avant de soumettre.',
      });
      return;
    }

    const session = this.authStore.session();
    if (!session?.emailVerified) {
      this.messageService.add({
        severity: 'error',
        summary: 'Action requise',
        detail: 'Veuillez vérifier votre email.',
      });
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      title: this.title().trim(),
      options: validOptions.map((text) => ({ text, votes: 0, id: crypto.randomUUID() })),
      expiresAt: this.expiresAt(),
      showResultsBeforeClose: this.showResults(),
      createdBy: session.name,
    };

    this.repository
      .createPoll(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Sondage créé',
            detail: 'Votre sondage est maintenant en ligne !',
          });
          onSuccess(); // Délégation de la navigation
        },
        error: () => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer le sondage.',
          });
        },
      });
  }
}
