export type CallStatus = 'success' | 'hang_up';

export interface CallRecord {
  id: string;
  flow: string;
  subscription: string;
  occurredAt: string;
  status: CallStatus;
}
