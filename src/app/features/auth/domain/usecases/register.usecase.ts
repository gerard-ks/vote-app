import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '@features/auth/domain/entities/auth.entity';
import { AuthRepository } from '@features/auth/domain/repositories/auth.repository';

export interface RegisterCommand {
  name: string;
  email: string;
  role: 'participant' | 'creator';
}

export abstract class RegisterUseCase {
  abstract execute(command: RegisterCommand): Observable<AuthUser>;
}

@Injectable()
export class RegisterUseCaseImpl implements RegisterUseCase {
  private readonly repository = inject(AuthRepository);

  public execute(command: RegisterCommand): Observable<AuthUser> {
    return this.repository.register(command.name, command.email, command.role);
  }
}
