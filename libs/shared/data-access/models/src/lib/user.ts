export interface User {
  email: string | null;
  uid: string | null;
  emailVerified: boolean;
  displayName: string | null;
}

/**
 * A structure representing the state of an observable
 */
export type UserState = {
  value: User;

  error?: any;

  loaded: boolean;

  isLogged: boolean;
};
