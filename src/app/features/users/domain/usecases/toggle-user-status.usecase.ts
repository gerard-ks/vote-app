import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '@features/users/domain/repositories/user.repository';

export interface ToggleUserStatusCommand {
  userId: string;
  newStatus: boolean;
}

export abstract class ToggleUserStatusUseCase {
  abstract execute(command: ToggleUserStatusCommand): Observable<void>;
}

@Injectable()
export class ToggleUserStatusUseCaseImpl implements ToggleUserStatusUseCase {
  private readonly repository = inject(UserRepository);

  public execute(command: ToggleUserStatusCommand): Observable<void> {
    return this.repository.toggleUserStatus(command.userId, command.newStatus);
  }
}
