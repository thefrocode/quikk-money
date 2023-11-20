export interface Transaction {
  id: string;
  amount: number;
  timestamp: { seconds: number; nanoseconds: number };
  sender_id: string;
  recepient_id: string;
}

export type TransactionsState = {
  value: Transaction[];
  error?: any;
  loaded: boolean;
};
