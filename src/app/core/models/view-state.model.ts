
export type ViewState<T> =
  | { type: 'IDLE' }
  | { type: 'LOADING' }
  | { type: 'ERROR'; message: string }
  | { type: 'EMPTY' }
  | { type: 'SUCCESS'; data: T };
