import { Injectable, signal } from '@angular/core';
import { PollRepository } from '@features/polls/domain/poll.repository';
import { Poll } from '@features/polls/domain/poll.entity';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { mockPolls } from '@features/polls/data/poll.mock';

@Injectable()
export class PollMockService implements PollRepository {
  private readonly _polls = signal<Poll[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly polls = this._polls.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();

  public getAll(): Observable<Poll[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return of(mockPolls).pipe(
      delay(300),
      tap({
        next: (data) => {
          this._polls.set(data);
          this._isLoading.set(false);
        },
        error: () => {
          this._error.set('Une erreur technique est survenue au chargement du scrutin.');
          this._isLoading.set(false);
        },
      }),
    );
  }

  public getById(id: string): Observable<Poll | null> {
    const foundPoll = mockPolls.find((p) => p.id === id) || null;
    return of(foundPoll).pipe(delay(150));
  }

  public getVotedPolls(userId: string): Observable<Poll[]> {
    // Si tu n'as pas encore appelé getAll, _polls() sera vide.
    // On utilise mockPolls en secours pour la démo.
    const source = this._polls().length > 0 ? this._polls() : mockPolls;

    const votedPolls = source.filter((p) =>
      // On vérifie si l'utilisateur est présent dans la liste des votants
      p.voters?.includes(userId),
    );

    return of(votedPolls).pipe(delay(150));
  }

  public vote(pollId: string, optionId: string): Observable<Poll> {
    const pollIndex = mockPolls.findIndex((p) => p.id === pollId);
    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    const poll = mockPolls[pollIndex];
    if (poll.status !== 'active') return throwError(() => new Error('Sondage inactif'));

    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return throwError(() => new Error('Option introuvable'));

    // Mutation de la "Base de données" en mémoire
    option.votes += 1;
    poll.totalVotes += 1;

    // On retourne une copie pour déclencher la détection de changement de l'UI
    return of({ ...poll }).pipe(delay(400));
  }

  public closePoll(pollId: string): Observable<Poll> {
    const pollIndex = mockPolls.findIndex((p) => p.id === pollId);
    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    const poll = mockPolls[pollIndex];
    // Mutation de la "Base de données" en mémoire
    poll.status = 'closed';

    return of({ ...poll }).pipe(delay(400));
  }

  public deletePoll(pollId: string): Observable<void> {
    const pollIndex = mockPolls.findIndex((p) => p.id === pollId);
    if (pollIndex === -1) return throwError(() => new Error('Sondage introuvable'));

    // On retire l'élément du tableau mocké
    mockPolls.splice(pollIndex, 1);

    return of(void 0).pipe(delay(400));
  }
}
