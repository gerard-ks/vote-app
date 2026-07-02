import { CreatePollRequestModel, PollModel } from '@features/polls/data/models/poll.model';
import { Observable } from 'rxjs';

export abstract class PollDataSource {
  abstract getAll(): Observable<PollModel[]>;
  abstract getById(id: string): Observable<PollModel | null>;
  abstract getVotedPolls(userId: string): Observable<PollModel[]>;
  abstract createPoll(payload: CreatePollRequestModel): Observable<PollModel>;
  abstract vote(pollId: string, optionId: string): Observable<PollModel>;
  abstract closePoll(pollId: string): Observable<PollModel>;
  abstract deletePoll(pollId: string): Observable<void>;
}
