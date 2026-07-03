import { PaginatedUsers } from '@features/users/domain/entities/user.entity';
import { inject, Injectable } from '@angular/core';
import { UserRepository } from '@features/users/domain/repositories/user.repository';
import { Observable } from 'rxjs';

export interface GetUsersCommand {
  page: number;
  limit: number;
  searchTerm?: string;
}

export abstract class GetUsersUseCase {
  abstract execute(command: GetUsersCommand): Observable<PaginatedUsers>;
}

@Injectable()
export class GetUsersUseCaseImpl implements GetUsersUseCase {
  private readonly repository = inject(UserRepository);

  public execute(command: GetUsersCommand): Observable<PaginatedUsers> {
    return this.repository.getUsers(command.page, command.limit, command.searchTerm);
  }
}
