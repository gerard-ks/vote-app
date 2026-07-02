import { Provider } from '@angular/core';
import { UserRepositoryImpl } from '@features/users/data/repositories/user.repository.impl';
import { UserRepository } from '@features/users/domain/user.repository';
import { UserDataSource } from '@features/users/data/datasources/user.datasource';
import { UserFakeDataSourceImpl } from '@features/users/data/datasources/user-fake.datasource.impl';

export const providerUsersFeature = (): Provider[] => {
  return [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    {provide: UserDataSource, useClass: UserFakeDataSourceImpl }
  ];
};
