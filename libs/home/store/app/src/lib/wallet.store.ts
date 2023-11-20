import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { WalletState } from '@quikk-money/models';
import { WalletApiService } from '@quikk-money/quikk-api';
import { CustomerStore } from '@quikk-money/auth-store';

@Injectable({
  providedIn: 'root',
})
export class WalletStore {
  walletApi = inject(WalletApiService);

  customerStore = inject(CustomerStore);

  private state = signal<WalletState>({
    value: {},
    loaded: false,
    error: null,
  });

  wallet = computed(() => this.state().value);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  constructor() {
    effect(() => {
      if (this.customerStore.loaded()) {
        this.getWallet();
      }
    });
  }

  getWallet() {
    this.walletApi
      .getWalletByCustomerId(this.customerStore.customer().id)
      .subscribe((wallet) => {
        this.state.update((s) => {
          return {
            ...s,
            value: wallet[0],
            loaded: true,
          };
        });
      });
  }
}
