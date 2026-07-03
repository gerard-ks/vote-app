import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';

export interface CreatePollCommand {
  title: string;
  options: { id: string; text: string; votes: number }[];
  expiresAt: string;
  showResultsBeforeClose: boolean;
  createdBy: string;
}

export abstract class CreatePollUseCase {
  abstract execute(command: CreatePollCommand): Observable<Poll>;
}

@Injectable()
export class CreatePollUseCaseImpl implements CreatePollUseCase {
  private readonly repository = inject(PollRepository);

  public execute(command: CreatePollCommand): Observable<Poll> {
    return this.repository.createPoll(command);
  }
}
