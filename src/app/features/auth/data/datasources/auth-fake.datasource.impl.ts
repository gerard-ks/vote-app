import { AuthDataSource } from '@features/auth/data/datasources/auth.datasource';
import { delay, Observable, of, throwError } from 'rxjs';
import { AuthUserModel } from '@features/auth/data/models/auth.model';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthFakeDatasourceImpl implements AuthDataSource {
  private readonly mockDatabase: AuthUserModel[] = [
    { full_name: 'Alice', role_type: 'creator', email_address: 'alice@example.com' },
    { full_name: 'Bob', role_type: 'participant', email_address: 'bob@example.com' },
    { full_name: 'Charlie', role_type: 'admin', email_address: 'dashboard@example.com' },
    { full_name: 'User Test', role_type: 'participant', email_address: 'user@example.com' },
    { full_name: 'Dave', role_type: 'creator', email_address: 'dave@example.com' },
  ];

  public login(rawEmail: string): Observable<AuthUserModel> {
    const cleanEmail = rawEmail.toLowerCase().trim();
    const accountDto = this.mockDatabase.find((u) => u.email_address === cleanEmail);

    if (!accountDto) {
      return throwError(() => new Error('Identifiants incorrects')).pipe(delay(600));
    }

    return of(accountDto).pipe(delay(600));
  }

  public register(name: string, email: string, role: string): Observable<AuthUserModel> {
    const cleanEmail = email.toLowerCase().trim();

    const exists = this.mockDatabase.some((u) => u.email_address === cleanEmail);
    if (exists) {
      return throwError(() => new Error('Cet email est déjà utilisé')).pipe(delay(600));
    }

    const newUserDto: AuthUserModel = {
      full_name: name,
      email_address: cleanEmail,
      role_type: role,
    };
    this.mockDatabase.push(newUserDto);

    return of(newUserDto).pipe(delay(600));
  }
}
