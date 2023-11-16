import { Injectable, signal, effect } from '@angular/core';

import {
  Customer,
  CustomerState,
  UserState,
  Wallet,
  WalletState,
} from '@quikk-money/models';
import { CustomerApiService, WalletApiService } from '@quikk-money/quikk-api';

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
  constructor(
    private customerApiService: CustomerApiService,
    private walletApiService: WalletApiService
  ) {
    effect(() => {
      if (this.user().isLogged) {
        this.getCustomerByUid(this.user().value.uid);
      }
    });
    effect(() => {
      if (this.customer().status === 'success') {
        this.getWalletByCustomerId(this.customer().value.id);
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
}
