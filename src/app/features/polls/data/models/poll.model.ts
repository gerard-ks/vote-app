export interface PollOptionModel {
  option_id: string;
  option_text: string;
  vote_count: number;
}

export interface PollModel {
  poll_id: string;
  question_title: string;
  options_list: PollOptionModel[];
  created_at_timestamp: string;
  expires_at_timestamp: string;
  creator_username: string;
  status_type: 'active' | 'closed' | 'pending';
  total_votes_count: number;
  is_results_visible: boolean;
  voter_emails: string[];
}

export interface CreatePollRequestModel{
  question_title: string;
  expires_at_timestamp: string;
  creator_username: string;
  is_results_visible: boolean;
  options_list: { option_text: string }[];
}
