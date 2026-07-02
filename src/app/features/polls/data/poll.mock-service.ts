import { Injectable, signal } from '@angular/core';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { Poll } from '@features/polls/domain/poll.entity';
import { delay, Observable, of, throwError } from 'rxjs';
import { mockPolls } from '@features/polls/data/poll.mock';

@Injectable()
export class PollMockService implements PollRepository {
  private readonly _db = signal<Poll[]>([...mockPolls]);

  public createPoll(payload: Partial<Poll>): Observable<Poll> {
    const newPoll: Poll = {
      id: crypto.randomUUID(), // Génération d'un ID unique simulé
      title: payload.title || 'Sondage sans titre',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0], // Ex: 2026-07-01
      expiresAt: payload.expiresAt || new Date().toISOString(),
      createdBy: payload.createdBy || 'Anonyme',
      totalVotes: 0,
      showResultsBeforeClose: payload.showResultsBeforeClose || false,
      options: payload.options || [],
      voters: [],
    };

    // On met à jour la "base de données" en insérant le nouveau sondage au début
    this._db.update((currentDb) => [newPoll, ...currentDb]);

    // On retourne le sondage créé avec un délai réseau simulé
    return of(newPoll).pipe(delay(500));
  }

  public getAll(): Observable<Poll[]> {
    return of(this._db()).pipe(delay(300));
  }

  public getById(id: string): Observable<Poll | null> {
    const foundPoll = this._db().find((p) => p.id === id) || null;
    return of(foundPoll).pipe(delay(150));
  }

  public getVotedPolls(userId: string): Observable<Poll[]> {
    const votedPolls = this._db().filter((p) => p.voters?.includes(userId));
    return of(votedPolls).pipe(delay(150));
  }

  public vote(pollId: string, optionId: string): Observable<Poll> {
    const currentDb = this._db();
    const pollIndex = currentDb.findIndex((p) => p.id === pollId);

    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    // On clone pour éviter les mutations directes sauvages
    const poll = { ...currentDb[pollIndex] };
    if (poll.status !== 'active') return throwError(() => new Error('Sondage inactif'));

    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return throwError(() => new Error('Option introuvable'));

    // Mutation simulée en base
    option.votes += 1;
    poll.totalVotes += 1;

    // Mise à jour de la "base de données"
    currentDb[pollIndex] = poll;
    this._db.set([...currentDb]);

    return of(poll).pipe(delay(400));
  }

  public closePoll(pollId: string): Observable<Poll> {
    const currentDb = this._db();
    const pollIndex = currentDb.findIndex((p) => p.id === pollId);

    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    const poll = { ...currentDb[pollIndex] };
    poll.status = 'closed';

    currentDb[pollIndex] = poll;
    this._db.set([...currentDb]);

    return of(poll).pipe(delay(400));
  }

  public deletePoll(pollId: string): Observable<void> {
    const currentDb = this._db();
    const pollIndex = currentDb.findIndex((p) => p.id === pollId);

    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    currentDb.splice(pollIndex, 1);
    this._db.set([...currentDb]);

    return of(void 0).pipe(delay(400));
  }
}
