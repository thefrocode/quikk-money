export interface Customer {
  id?: string;
  uid?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export type CustomerState = {
  value: Customer;

  error?: any;

  loaded: boolean;
};
