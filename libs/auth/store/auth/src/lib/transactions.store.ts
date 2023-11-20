import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Transaction, TransactionsState } from '@quikk-money/models';
import { TransactionApiService } from '@quikk-money/quikk-api';
import { CustomerStore } from './customer.store';

@Injectable({ providedIn: 'root' })
export class TransactionsStore {
  transactionsApi = inject(TransactionApiService);

  customerStore = inject(CustomerStore);
  private state = signal<TransactionsState>({
    value: [],
    loaded: false,
    error: null,
  });

  transactions = computed(() => this.state().value);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  constructor() {
    effect(() => {
      if (this.customerStore.loaded()) {
        this.getTransactions();
      }
    });
  }
  getTransactions(customerId?: string) {
    this.transactionsApi
      .getAllTransactionsByCustomerId(customerId)
      .subscribe((res: Transaction[]) => {
        this.state.update((s) => {
          console.log(res);
          return {
            ...s,
            value: res,
            loaded: true,
          };
        });
      });
  }
}
