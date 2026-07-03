import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '@features/auth/domain/entities/auth.entity';
import { AuthRepository } from '@features/auth/domain/repositories/auth.repository';

export abstract class LoginUseCase {
  abstract execute(email: string): Observable<AuthUser>;
}

@Injectable()
export class LoginUseCaseImpl implements LoginUseCase {
  private readonly repository = inject(AuthRepository);

  public execute(email: string): Observable<AuthUser> {
    return this.repository.login(email);
  }
}
