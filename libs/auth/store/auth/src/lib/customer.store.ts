import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CustomerState } from '@quikk-money/models';
import { AuthService, CustomerApiService } from '@quikk-money/quikk-api';

@Injectable({
  providedIn: 'root',
})
export class CustomerStore {
  customerApi = inject(CustomerApiService);

  authStore = inject(AuthService);

  private state = signal<CustomerState>({
    value: {},
    loaded: false,
    error: null,
  });

  customer = computed(() => this.state().value);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  constructor() {
    effect(() => {
      if (this.authStore.isLogged()) {
        this.getCustomer();
      }
    });
  }

  getCustomer() {
    this.customerApi
      .getCustomerByUid(this.authStore.user().uid)
      .subscribe((customer) => {
        this.state.update((s) => {
          return {
            ...s,
            value: customer[0],
            loaded: true,
          };
        });
      });
  }
}
