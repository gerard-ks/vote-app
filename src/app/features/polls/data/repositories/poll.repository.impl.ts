import { inject, Injectable } from '@angular/core';
import { PollRepository } from '@features/polls/domain/repositories/poll.repository';
import { Poll } from '@features/polls/domain/entities/poll.entity';
import { PollDataSource } from '@features/polls/data/datasources/poll.datasource';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PollMapper } from '@features/polls/data/mappers/poll.mapper';

@Injectable()
export class PollRepositoryImpl implements PollRepository {
  private readonly dataSource = inject(PollDataSource);

  public getAll(): Observable<Poll[]> {
    return this.dataSource
      .getAll()
      .pipe(map((dtos) => dtos.map((dto) => PollMapper.toDomain(dto))));
  }

  public getById(id: string): Observable<Poll | null> {
    return this.dataSource.getById(id).pipe(map((dto) => (dto ? PollMapper.toDomain(dto) : null)));
  }

  public getVotedPolls(userId: string): Observable<Poll[]> {
    return this.dataSource
      .getVotedPolls(userId)
      .pipe(map((dtos) => dtos.map((dto) => PollMapper.toDomain(dto))));
  }

  public createPoll(payload: Partial<Poll>): Observable<Poll> {
    const requestDto = PollMapper.toCreateDto(payload);

    return this.dataSource.createPoll(requestDto).pipe(map((dto) => PollMapper.toDomain(dto)));
  }

  public vote(pollId: string, optionId: string): Observable<Poll> {
    return this.dataSource.vote(pollId, optionId).pipe(map((dto) => PollMapper.toDomain(dto)));
  }

  public closePoll(pollId: string): Observable<Poll> {
    return this.dataSource.closePoll(pollId).pipe(map((dto) => PollMapper.toDomain(dto)));
  }

  public deletePoll(pollId: string): Observable<void> {
    return this.dataSource.deletePoll(pollId);
  }
}
