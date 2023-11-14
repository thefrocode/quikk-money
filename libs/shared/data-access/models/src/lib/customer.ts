export interface Customer {
  uid?: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}
