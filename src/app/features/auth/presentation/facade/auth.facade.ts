import { Injectable, signal, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ViewState } from '@core/models/view-state.model';
import { AuthRepository } from '@features/auth/domain/auth.repository';
import { AuthStore } from '@store/auth/auth.store';
import { UserRole, UserSession } from '@store/auth/auth.model';

@Injectable()
export class AuthFacade {
  private readonly messageService = inject(MessageService);
  private readonly authStore = inject(AuthStore);
  private readonly repository = inject(AuthRepository);

  private readonly _state = signal<ViewState<null>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  public readonly signupRole = signal<'participant' | 'creator'>('participant');

  public setRole(role: 'participant' | 'creator'): void {
    this.signupRole.set(role);
  }

  public login(rawEmail: string, onSuccess: (role: UserRole) => void): void {
    this._state.set({ type: 'LOADING' });

    this.repository.login(rawEmail).subscribe({
      next: (user) => {
        const session: UserSession = {
          id: crypto.randomUUID(),
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          emailVerified: true,
        };

        this.authStore.setSession(session);
        this._state.set({ type: 'SUCCESS', data: null });

        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenue',
          detail: `Heureux de vous revoir, ${user.name} !`,
        });

        onSuccess(session.role);
      },
      error: (err: Error) => {
        const errorMessage =
          err.message || 'Impossible de se connecter. Vérifiez vos identifiants.';
        this._state.set({ type: 'ERROR', message: errorMessage });
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de connexion',
          detail: errorMessage,
        });
      },
    });
  }

  public register(
    name: string,
    email: string,
    role: 'participant' | 'creator',
    onSuccess: () => void,
  ): void {
    this._state.set({ type: 'LOADING' });

    this.repository.register(name, email, role).subscribe({
      next: (user) => {
        const session: UserSession = {
          id: crypto.randomUUID(),
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          emailVerified: true,
        };

        this.authStore.setSession(session);
        this._state.set({ type: 'SUCCESS', data: null });

        this.messageService.add({
          severity: 'success',
          summary: 'Compte créé',
          detail: 'Votre compte a été activé avec succès.',
        });

        onSuccess();
      },
      error: (err: Error) => {
        const errorMessage =
          err.message || 'Une erreur est survenue lors de la création du compte.';
        this._state.set({ type: 'ERROR', message: errorMessage });
        this.messageService.add({
          severity: 'error',
          summary: 'Inscription impossible',
          detail: errorMessage,
        });
      },
    });
  }
}
