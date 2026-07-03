import { Provider } from '@angular/core';
import { UserRepositoryImpl } from '@features/users/data/repositories/user.repository.impl';
import { UserRepository } from '@features/users/domain/repositories/user.repository';
import { UserDataSource } from '@features/users/data/datasources/user.datasource';
import { UserFakeDataSourceImpl } from '@features/users/data/datasources/user-fake.datasource.impl';
import {
  GetUsersUseCase,
  GetUsersUseCaseImpl,
} from '@features/users/domain/usecases/get-users.usecase';
import {
  ToggleUserStatusUseCase,
  ToggleUserStatusUseCaseImpl,
} from '@features/users/domain/usecases/toggle-user-status.usecase';
import {
  VerifyUserEmailUseCase,
  VerifyUserEmailUseCaseImpl,
} from '@features/users/domain/usecases/verify-user-email.usecase';

export const providerUsersFeature = (): Provider[] => {
  return [
    { provide: GetUsersUseCase, useClass: GetUsersUseCaseImpl },
    { provide: ToggleUserStatusUseCase, useClass: ToggleUserStatusUseCaseImpl },
    { provide: VerifyUserEmailUseCase, useClass: VerifyUserEmailUseCaseImpl },
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: UserDataSource, useClass: UserFakeDataSourceImpl },
  ];
};
