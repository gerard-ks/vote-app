import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Poll } from '../../domain/entities/poll.entity';
import { PollRepository } from '../../domain/repositories/poll.repository';

export abstract class GetVotedPollsUseCase {
  abstract execute(userId: string): Observable<Poll[]>;
}

@Injectable()
export class GetVotedPollsUseCaseImpl implements GetVotedPollsUseCase {
  private readonly repository = inject(PollRepository);

  public execute(userId: string): Observable<Poll[]> {
    return this.repository.getVotedPolls(userId);
  }
}
