import { Provider } from '@angular/core';
import { AuthMockRepository } from '@features/auth/data/auth-mock.repository';
import { AuthRepository } from '@features/auth/domain/auth.repository';

export const provideAuthFeature = (): Provider[] => {
  return [
    { provide: AuthRepository, useClass: AuthMockRepository },
  ];
};
