import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '@features/users/domain/repositories/user.repository';

export abstract class VerifyUserEmailUseCase {
  abstract execute(userId: string): Observable<void>;
}

@Injectable()
export class VerifyUserEmailUseCaseImpl implements VerifyUserEmailUseCase {
  private readonly repository = inject(UserRepository);

  public execute(userId: string): Observable<void> {
    return this.repository.verifyUserEmail(userId);
  }
}
