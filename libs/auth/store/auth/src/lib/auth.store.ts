import { Injectable, signal, effect } from '@angular/core';

import {
  Customer,
  CustomerState,
  Transaction,
  TransactionsState,
  UserState,
  Wallet,
  WalletState,
} from '@quikk-money/models';
import {
  CustomerApiService,
  TransactionApiService,
  WalletApiService,
} from '@quikk-money/quikk-api';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  customer = signal<CustomerState>({
    value: {},
    status: 'pending',
  });
  user = signal<UserState>({
    value: {},
    status: 'pending',
    isLogged: false,
  });
  wallet = signal<WalletState>({
    value: {},
    status: 'pending',
  });
  transactions = signal<TransactionsState>({ value: [], status: 'pending' });
  constructor(
    private customerApiService: CustomerApiService,
    private walletApiService: WalletApiService,
    private transactionApiService: TransactionApiService
  ) {
    effect(() => {
      if (this.user().isLogged) {
        this.getCustomerByUid(this.user().value.uid);
      }
    });
    effect(() => {
      if (this.customer().status === 'success') {
        this.getWalletByCustomerId(this.customer().value.id);
        this.getTransactionsByCustomerId(this.customer().value.id);
      }
    });
  }

  setUser(data: UserState) {
    this.user.set(data);
  }
  updateUser(error: any, status: 'pending' | 'success' | 'error') {
    this.user.update((s) => ({
      ...s,
      error,
      status,
    }));
  }
  setCustomer(data: CustomerState) {
    this.customer.set(data);
  }

  getCustomerByUid(uid?: string) {
    this.customerApiService.getOneByUid(uid).subscribe((res: Customer[]) => {
      this.customer.set({
        value: res[0],
        status: 'success',
      });
    });
  }

  getWalletByCustomerId(customerId?: string) {
    this.walletApiService
      .getWalletByCustomerId(customerId)
      .subscribe((res: Wallet[]) => {
        this.wallet.set({
          value: res[0],
          status: 'success',
        });
      });
  }
  getTransactionsByCustomerId(customerId?: string) {
    this.transactionApiService
      .getAllTransactionsByCustomerId(customerId)
      .subscribe((res: Transaction[]) => {
        this.transactions.set({
          value: res,
          status: 'success',
        });
      });
  }
}
