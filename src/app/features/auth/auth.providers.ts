import { Provider } from '@angular/core';
import { AuthRepositoryImpl } from '@features/auth/data/repositories/auth.repository.impl';
import { AuthRepository } from '@features/auth/domain/repositories/auth.repository';
import { AuthDataSource } from '@features/auth/data/datasources/auth.datasource';
import { AuthFakeDatasourceImpl } from '@features/auth/data/datasources/auth-fake.datasource.impl';
import { LoginUseCase, LoginUseCaseImpl } from '@features/auth/domain/usecases/login.usecase';
import {
  RegisterUseCase,
  RegisterUseCaseImpl,
} from '@features/auth/domain/usecases/register.usecase';


export const provideAuthFeature = (): Provider[] => {
  return [
    { provide: LoginUseCase, useClass: LoginUseCaseImpl },
    { provide: RegisterUseCase, useClass: RegisterUseCaseImpl },
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: AuthDataSource, useClass: AuthFakeDatasourceImpl },
  ];
};
