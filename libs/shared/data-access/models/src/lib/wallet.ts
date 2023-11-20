export interface Wallet {
  customer_id?: string;
  balance?: number;
  id?: string;
}

export type WalletState = {
  value: Wallet;

  error?: any;

  loaded: boolean;
};
