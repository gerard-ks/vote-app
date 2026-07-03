import { Observable } from 'rxjs';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { inject, Injectable } from '@angular/core';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';

export abstract class ClosePollUseCase {
  abstract execute(pollId: string): Observable<Poll>;
}

@Injectable()
export class ClosePollUseCaseImpl implements ClosePollUseCase {
  private readonly repository = inject(PollRepository);

  public execute(pollId: string): Observable<Poll> {
    return this.repository.closePoll(pollId);
  }
}
