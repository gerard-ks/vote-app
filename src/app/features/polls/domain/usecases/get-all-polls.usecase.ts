import { Observable } from 'rxjs';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';
import { inject, Injectable } from '@angular/core';

export abstract class GetAllPollsUseCase {
  abstract execute(): Observable<Poll[]>;
}

@Injectable()
export class GetAllPollsUseCaseImpl implements GetAllPollsUseCase {
  private readonly repository = inject(PollRepository);

  public execute(): Observable<Poll[]> {
    return this.repository.getAll();
  }
}
