import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';

export abstract class DeletePollUseCase {
  abstract execute(pollId: string): Observable<void>;
}

@Injectable()
export class DeletePollUseCaseImpl implements DeletePollUseCase {
  private readonly repository = inject(PollRepository);

  public execute(pollId: string): Observable<void> {
    return this.repository.deletePoll(pollId);
  }
}
