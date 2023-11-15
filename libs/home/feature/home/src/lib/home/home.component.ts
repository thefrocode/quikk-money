import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  CustomerApiService,
  WalletApiService,
  TransactionApiService,
} from '@quikk-money/quikk-api';
import { AuthStore } from '@quikk-money/auth-store';
import { Customer } from '@quikk-money/models';
@Component({
  selector: 'quikk-money-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public authService = inject(AuthService);
  //public authStore = inject(AuthStore);
  public customerApiService = inject(CustomerApiService);
  public walletApiService = inject(WalletApiService);
  public transactionApiService = inject(TransactionApiService);
  public user = this.authStore.user;
  public customer = this.authStore.customer;
  public wallet = this.authStore.wallet;
  recipient = signal<Customer>({});
  count = signal(0);

  constructor(public authStore: AuthStore) {}
  ngOnInit(): void {
    console.log('user', this.wallet());
  }
  topUp() {
    const balance = this.wallet().value.balance;
    this.walletApiService.update(this.customer().value.id, {
      balance: balance ? balance + 100 : 100,
    });
    this.authStore.getWalletByCustomerId(this.customer().value.id);
  }
  searchCustomer(phoneNumber: string) {
    this.customerApiService
      .getOneByPhone(phoneNumber)
      .subscribe((customer: any) => {
        this.recipient.set(customer[0]);
        this.count.set(0);
      });
  }
  sendMoney(amount: string) {
    const sender = this.customer().value.id;
    const recipient = this.recipient().id;
    if (sender && recipient && amount) {
      this.transactionApiService.sendMoney(sender, recipient, parseInt(amount));
    }
  }
}
