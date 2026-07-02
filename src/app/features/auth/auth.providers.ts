import { Provider } from '@angular/core';
import { AuthRepositoryImpl } from '@features/auth/data/repositories/auth.repository.impl';
import { AuthRepository } from '@features/auth/domain/auth.repository';
import { AuthDataSource } from '@features/auth/data/datasources/auth.datasource';
import { AuthFakeDatasourceImpl } from '@features/auth/data/datasources/auth-fake.datasource.impl';

export const provideAuthFeature = (): Provider[] => {
  return [
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: AuthDataSource, useClass: AuthFakeDatasourceImpl }
  ];
};
