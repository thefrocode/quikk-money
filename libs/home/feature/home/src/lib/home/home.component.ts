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
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TopUpDialogComponent } from '@quikk-money/top-up-dialog';
import {
  radixIdCard,
  radixPaperPlane,
  radixPerson,
  radixInfoCircled,
} from '@ng-icons/radix-icons';

@Component({
  selector: 'quikk-money-home',
  standalone: true,
  imports: [
    CommonModule,
    HlmButtonDirective,
    HlmIconComponent,
    MatDialogModule,
  ],
  providers: [
    provideIcons({
      radixIdCard,
      radixPaperPlane,
      radixPerson,
      radixInfoCircled,
    }),
  ],
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

  constructor(public authStore: AuthStore, private dialog: MatDialog) {}
  ngOnInit(): void {
    console.log('user', this.wallet());
  }
  openTopUpDialog() {
    const dialogRef = this.dialog.open(TopUpDialogComponent);
    dialogRef.afterClosed().subscribe((result: { amount: string }) => {
      console.log('amount', result);
      this.walletApiService.update(this.customer().value.id, {
        amount: result.amount,
      });
      this.authStore.getWalletByCustomerId(this.customer().value.id);
    });
  }
  topUp() {
    const balance = this.wallet().value.balance;
    this.walletApiService.update(this.customer().value.id, {
      balance: balance ? balance + 100 : 100,
    });
  }
  searchCustomer(phoneNumber: string) {
    this.customerApiService
      .getOneByPhone(phoneNumber)
      .subscribe((customer: any) => {
        this.recipient.set(customer[0]);
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
