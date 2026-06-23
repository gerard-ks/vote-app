import { Provider } from '@angular/core';
import { UserMockRepository } from '@features/users/data/user-mock.repository';
import { UserRepository } from '@features/users/domain/user.repository';

export const providerUsersFeature = (): Provider[] => {
  return [{ provide: UserRepository, useClass: UserMockRepository }];
};
