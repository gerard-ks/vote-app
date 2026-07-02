import { Injectable, signal } from '@angular/core';
import { PollDataSource } from '@features/polls/data/datasources/poll.datasource';
import { CreatePollRequestModel, PollModel } from '@features/polls/data/models/poll.model';
import { mockPolls } from '@features/polls/data/datasources/poll.mock';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable()
export class PollFakeDataSourceImpl implements PollDataSource {
  private readonly _db = signal<PollModel[]>(
    mockPolls.map((p) => ({
      poll_id: p.id,
      question_title: p.title,
      options_list: p.options.map((o) => ({
        option_id: o.id,
        option_text: o.text,
        vote_count: o.votes,
      })),
      created_at_timestamp: p.createdAt,
      expires_at_timestamp: p.expiresAt,
      creator_username: p.createdBy,
      status_type: p.status,
      total_votes_count: p.totalVotes,
      is_results_visible: p.showResultsBeforeClose,
      voter_emails: p.voters || [],
    })),
  );

  public getAll(): Observable<PollModel[]> {
    return of(this._db()).pipe(delay(300));
  }

  public getById(id: string): Observable<PollModel | null> {
    const found = this._db().find((p) => p.poll_id === id) || null;
    return of(found).pipe(delay(150));
  }

  public getVotedPolls(userId: string): Observable<PollModel[]> {
    const voted = this._db().filter((p) => p.voter_emails.includes(userId));
    return of(voted).pipe(delay(150));
  }

  public createPoll(payload: CreatePollRequestModel): Observable<PollModel> {
    const newPollModel: PollModel = {
      poll_id: crypto.randomUUID(),
      question_title: payload.question_title,
      options_list: payload.options_list.map((o, i) => ({
        option_id: `o_new_${i}`,
        option_text: o.option_text,
        vote_count: 0,
      })),
      created_at_timestamp: new Date().toISOString().split('T')[0],
      expires_at_timestamp: payload.expires_at_timestamp,
      creator_username: payload.creator_username,
      status_type: 'active',
      total_votes_count: 0,
      is_results_visible: payload.is_results_visible,
      voter_emails: [],
    };

    this._db.update((currentDb) => [newPollModel, ...currentDb]);
    return of(newPollModel).pipe(delay(500));
  }

  public vote(pollId: string, optionId: string): Observable<PollModel> {
    const currentDb = this._db();
    const pollIndex = currentDb.findIndex((p) => p.poll_id === pollId);

    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    const poll = { ...currentDb[pollIndex] };
    if (poll.status_type !== 'active') return throwError(() => new Error('Sondage inactif'));

    const option = poll.options_list.find((o) => o.option_id === optionId);
    if (!option) return throwError(() => new Error('Option introuvable'));

    option.vote_count += 1;
    poll.total_votes_count += 1;

    currentDb[pollIndex] = poll;
    this._db.set([...currentDb]);

    return of(poll).pipe(delay(400));
  }

  public closePoll(pollId: string): Observable<PollModel> {
    const currentDb = this._db();
    const pollIndex = currentDb.findIndex((p) => p.poll_id === pollId);
    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    const poll = { ...currentDb[pollIndex] };
    poll.status_type = 'closed';
    currentDb[pollIndex] = poll;
    this._db.set([...currentDb]);

    return of(poll).pipe(delay(400));
  }

  public deletePoll(pollId: string): Observable<void> {
    const currentDb = this._db();
    const pollIndex = currentDb.findIndex((p) => p.poll_id === pollId);
    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    currentDb.splice(pollIndex, 1);
    this._db.set([...currentDb]);

    return of(void 0).pipe(delay(400));
  }
}
