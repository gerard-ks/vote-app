export type PollStatus = 'active' | 'closed' | 'pending';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  status: PollStatus;
  totalVotes: number;
  showResultsBeforeClose: boolean;
  voters?: string[];
}
