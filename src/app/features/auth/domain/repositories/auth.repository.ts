import { Observable } from 'rxjs';
import { AuthUser, AuthRole } from '../entities/auth.entity';

export abstract class AuthRepository {
  abstract login(email: string): Observable<AuthUser>;
  abstract register(
    name: string,
    email: string,
    role: Omit<AuthRole, 'admin'>,
  ): Observable<AuthUser>;
}
