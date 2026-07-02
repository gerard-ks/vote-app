import { Provider } from '@angular/core';
import { PollRepositoryImpl } from '@features/polls/data/repositories/poll.repository.impl';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { PollListFacade } from '@features/polls/presentation/facade/poll-list.facade';
import { PollDataSource } from '@features/polls/data/datasources/poll.datasource';
import { PollFakeDataSourceImpl } from '@features/polls/data/datasources/poll-fake.datasource.impl';

export const providePollFeature = (): Provider[] => {
  return [
    { provide: PollRepository, useClass: PollRepositoryImpl },
    { provide: PollDataSource, useClass: PollFakeDataSourceImpl }
  ];
};
