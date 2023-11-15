export interface Customer {
  id?: string;
  uid?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

/**
 * A structure representing the state of an observable
 */
export type CustomerState = {
  /** The value (initial or produced by the observable) */
  value: Customer;
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: 'pending' | 'success' | 'error';
};
