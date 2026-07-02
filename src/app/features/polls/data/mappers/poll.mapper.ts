import { Poll, PollOption } from '../../domain/poll.entity';
import {
  CreatePollRequestModel,
  PollModel,
  PollOptionModel,
} from '@features/polls/data/models/poll.model';

export class PollMapper {
  static toDomain(dto: PollModel): Poll {
    return {
      id: dto.poll_id,
      title: dto.question_title,
      options: dto.options_list.map(this.toOptionDomain),
      createdAt: dto.created_at_timestamp,
      expiresAt: dto.expires_at_timestamp,
      createdBy: dto.creator_username,
      status: dto.status_type,
      totalVotes: dto.total_votes_count,
      showResultsBeforeClose: dto.is_results_visible,
      voters: dto.voter_emails,
    };
  }

  static toOptionDomain(dto: PollOptionModel): PollOption {
    return {
      id: dto.option_id,
      text: dto.option_text,
      votes: dto.vote_count,
    };
  }

  static toCreateDto(payload: Partial<Poll>): CreatePollRequestModel {
    return {
      question_title: payload.title || 'Sondage sans titre',
      expires_at_timestamp: payload.expiresAt || new Date().toISOString(),
      creator_username: payload.createdBy || 'Anonyme',
      is_results_visible: payload.showResultsBeforeClose || false,
      options_list: payload.options ? payload.options.map((o) => ({ option_text: o.text })) : [],
    };
  }
}
