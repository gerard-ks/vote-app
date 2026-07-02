import { Poll } from '@features/polls/domain/poll.entity';
import { Observable } from 'rxjs';

export abstract class PollRepository {
  abstract getAll(): Observable<Poll[]>;
  abstract getById(id: string): Observable<Poll | null>;

  abstract getVotedPolls(userId: string): Observable<Poll[]>;
  abstract createPoll(payload: Partial<Poll>): Observable<Poll>;

  abstract vote(pollId: string, optionId: string): Observable<Poll>;
  abstract closePoll(pollId: string): Observable<Poll>;
  abstract deletePoll(pollId: string): Observable<void>;
}
