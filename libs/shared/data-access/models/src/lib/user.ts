export interface User {
  email?: string;
  uid?: string;
  emailVerified?: boolean;
  displayName?: string;
}

/**
 * A structure representing the state of an observable
 */
export type UserState = {
  /** The value (initial or produced by the observable) */
  value: User;
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: 'pending' | 'success' | 'error';

  isLogged: boolean;
};
