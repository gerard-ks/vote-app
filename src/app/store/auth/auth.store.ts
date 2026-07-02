import { computed, Injectable, signal } from '@angular/core';
import { UserSession } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // Initialisation synchrone : Angular lit le localStorage AVANT de lancer les Guards
  private readonly _session = signal<UserSession | null>(this.loadSessionFromStorage());

  public readonly session = this._session.asReadonly();

  public readonly isAuthenticated = computed(() => this.session() !== null);
  public readonly isParticipant = computed(() => this.session()?.role === 'participant');
  public readonly isCreator = computed(() => this.session()?.role === 'creator');
  public readonly isAdmin = computed(() => this.session()?.role === 'admin');
  public readonly canCreate = computed(() => this.isCreator() && !this.isAdmin());

  public setSession(session: UserSession): void {
    this._session.set(session);
    localStorage.setItem('auth_session', JSON.stringify(session));
  }

  public clearSession(): void {
    this._session.set(null);
    localStorage.removeItem('auth_session');
  }

  // Utilitaire pour récupérer la session instantanément au démarrage
  private loadSessionFromStorage(): UserSession | null {
    const stored = localStorage.getItem('auth_session');

    if (!stored) return null;

    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      return null;
    }
  }
}
