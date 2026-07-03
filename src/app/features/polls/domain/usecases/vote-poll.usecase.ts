import { Observable } from 'rxjs';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { inject, Injectable } from '@angular/core';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';

export interface VoteCommand {
  pollId: string;
  optionId: string;
}

export abstract class VotePollUseCase {
  abstract execute(command: VoteCommand): Observable<Poll>;
}

@Injectable()
export class VotePollUseCaseImpl implements VotePollUseCase {
  private readonly repository = inject(PollRepository);

  public execute(command: VoteCommand): Observable<Poll> {
    return this.repository.vote(command.pollId, command.optionId);
  }
}
