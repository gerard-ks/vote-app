import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthRepository } from '../domain/auth.repository';
import { AuthUser, AuthRole } from '../domain/auth.entity';

@Injectable()
export class AuthMockRepository implements AuthRepository {
  private readonly mockDatabase: AuthUser[] = [
    { name: 'Alice', role: 'creator', email: 'alice@example.com' },
    { name: 'Bob', role: 'participant', email: 'bob@example.com' },
    { name: 'Charlie', role: 'admin', email: 'dashboard@example.com' },
    { name: 'User Test', role: 'participant', email: 'user@example.com' },
    { name: 'Dave', role: 'creator', email: 'dave@example.com' },
  ];

  public login(rawEmail: string): Observable<AuthUser> {
    const cleanEmail = rawEmail.toLowerCase().trim();
    const account = this.mockDatabase.find((u) => u.email === cleanEmail);

    if (!account) {
      return throwError(() => new Error('Identifiants incorrects')).pipe(delay(600));
    }

    return of(account).pipe(delay(600)); // Simulation réseau
  }

  public register(
    name: string,
    email: string,
    role: 'participant' | 'creator',
  ): Observable<AuthUser> {
    const cleanEmail = email.toLowerCase().trim();

    // On vérifie si l'email existe déjà (simulation erreur 409 Conflict)
    const exists = this.mockDatabase.some((u) => u.email === cleanEmail);
    if (exists) {
      return throwError(() => new Error('Cet email est déjà utilisé')).pipe(delay(600));
    }

    const newUser: AuthUser = { name, email: cleanEmail, role };

    this.mockDatabase.push(newUser);

    return of(newUser).pipe(delay(600));
  }
}
