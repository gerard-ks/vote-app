export type PollFilterType = 'all' | 'active' | 'closed' | 'pending';

export interface FilterOption {
  value: PollFilterType;
  label: string;
}

export const POLL_FILTER_CONFIG: FilterOption[] = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'closed', label: 'Clos' },
  { value: 'pending', label: 'En attente' },
];
