import { Provider } from '@angular/core';
import { PollRepositoryImpl } from '@features/polls/data/repositories/poll.repository.impl';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';
import { PollDataSource } from '@features/polls/data/datasources/poll.datasource';
import { PollFakeDataSourceImpl } from '@features/polls/data/datasources/poll-fake.datasource.impl';
import {
  CreatePollUseCase,
  CreatePollUseCaseImpl,
} from '@features/polls/domain/usecases/create-poll.usecase';
import {
  GetPollByIdUseCase,
  GetPollByIdUseCaseImpl,
} from '@features/polls/domain/usecases/get-poll-by-id.usecase';
import {
  VotePollUseCase,
  VotePollUseCaseImpl,
} from '@features/polls/domain/usecases/vote-poll.usecase';
import {
  ClosePollUseCase,
  ClosePollUseCaseImpl,
} from '@features/polls/domain/usecases/close-poll.usecase';
import {
  GetAllPollsUseCase,
  GetAllPollsUseCaseImpl,
} from '@features/polls/domain/usecases/get-all-polls.usecase';
import {
  GetVotedPollsUseCase,
  GetVotedPollsUseCaseImpl,
} from '@features/polls/domain/usecases/get-voted-polls.usecase';
import {
  DeletePollUseCase,
  DeletePollUseCaseImpl,
} from '@features/polls/domain/usecases/delete-poll.usecase';

export const providePollFeature = (): Provider[] => {
  return [
    { provide: CreatePollUseCase, useClass: CreatePollUseCaseImpl },
    { provide: GetPollByIdUseCase, useClass: GetPollByIdUseCaseImpl },
    { provide: VotePollUseCase, useClass: VotePollUseCaseImpl },
    { provide: ClosePollUseCase, useClass: ClosePollUseCaseImpl },
    { provide: GetAllPollsUseCase, useClass: GetAllPollsUseCaseImpl },
    { provide: GetVotedPollsUseCase, useClass: GetVotedPollsUseCaseImpl },
    { provide: DeletePollUseCase, useClass: DeletePollUseCaseImpl },
    { provide: PollRepository, useClass: PollRepositoryImpl },
    { provide: PollDataSource, useClass: PollFakeDataSourceImpl },
  ];
};
