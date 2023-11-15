export interface Wallet {
  customer_id?: string;
  balance?: number;
  id?: string;
}
/**
 * A structure representing the state of an observable
 */
export type WalletState = {
  /** The value (initial or produced by the observable) */
  value: Wallet;
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: 'pending' | 'success' | 'error';
};
