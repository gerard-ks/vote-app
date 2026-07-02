import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserRepository } from '../../domain/user.repository';
import { PaginatedUsers } from '../../domain/user.entity';
import { UserDataSource } from '../datasources/user.datasource';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly dataSource = inject(UserDataSource);

  public getUsers(page: number, limit: number, searchTerm?: string): Observable<PaginatedUsers> {
    return this.dataSource.getUsers(page, limit, searchTerm).pipe(
      map((dto) => UserMapper.toPaginatedDomain(dto)),
    );
  }

  public toggleUserStatus(userId: string, newStatus: boolean): Observable<void> {
    return this.dataSource.toggleUserStatus(userId, newStatus);
  }

  public verifyUserEmail(userId: string): Observable<void> {
    return this.dataSource.verifyUserEmail(userId);
  }
}
