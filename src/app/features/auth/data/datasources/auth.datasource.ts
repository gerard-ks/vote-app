import { AuthUserModel } from '@features/auth/data/models/auth.model';
import { Observable } from 'rxjs';

export abstract class AuthDataSource {
  abstract login(email: string): Observable<AuthUserModel>;
  abstract register(name: string, email: string, role: string): Observable<AuthUserModel>;
}
