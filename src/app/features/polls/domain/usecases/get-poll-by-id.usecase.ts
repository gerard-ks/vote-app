import { Observable } from 'rxjs';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { inject, Injectable } from '@angular/core';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';

export abstract class GetPollByIdUseCase {
  abstract execute(pollId: string): Observable<Poll | null>;
}

@Injectable()
export class GetPollByIdUseCaseImpl implements GetPollByIdUseCase {
  private readonly repository = inject(PollRepository);

  public execute(pollId: string): Observable<Poll | null> {
    return this.repository.getById(pollId);
  }
}
