import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthUser, AuthRole } from '../../domain/entities/auth.entity';
import { AuthDataSource } from '../datasources/auth.datasource';
import { AuthMapper } from '../mappers/auth.mapper';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private readonly dataSource = inject(AuthDataSource);

  public login(rawEmail: string): Observable<AuthUser> {
    return this.dataSource.login(rawEmail).pipe(
      map((dto) => AuthMapper.toDomain(dto)),
    );
  }

  public register(name: string, email: string, role: AuthRole): Observable<AuthUser> {
    return this.dataSource.register(name, email, role).pipe(
      map((dto) => AuthMapper.toDomain(dto)),
    );
  }
}
