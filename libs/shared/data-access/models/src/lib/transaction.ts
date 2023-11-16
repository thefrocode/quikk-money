export interface Transaction {
  id: string;
  amount: number;
  timestamp: { seconds: number; nanoseconds: number };
  sender_id: string;
  recepient_id: string;
}

export type TransactionsState = {
  /** The value (initial or produced by the observable) */
  value: Transaction[];
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: 'pending' | 'success' | 'error';
};
