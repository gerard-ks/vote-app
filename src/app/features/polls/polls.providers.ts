import { Provider } from '@angular/core';
import { PollMockService } from '@features/polls/data/poll.mock-service';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { PollListFacade } from '@features/polls/presentation/facade/poll-list.facade';

export const providePollFeature = (): Provider[] => {
  return [
    { provide: PollRepository, useClass: PollMockService },
  ];
};
