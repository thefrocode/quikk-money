import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  CustomerApiService,
  WalletApiService,
  TransactionApiService,
} from '@quikk-money/quikk-api';
import { TransactionsStore, WalletStore } from '@quikk-money/app-store';
import { AuthStore, CustomerStore } from '@quikk-money/auth-store';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TopUpDialogComponent } from '@quikk-money/top-up-dialog';
import { SendMoneyDialogComponent } from '@quikk-money/send-money-dialog';
import {
  radixIdCard,
  radixPaperPlane,
  radixPerson,
  radixInfoCircled,
} from '@ng-icons/radix-icons';
import { ToastrService } from 'ngx-toastr';

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
  authService = inject(AuthService);
  customerApiService = inject(CustomerApiService);
  walletApiService = inject(WalletApiService);
  transactionApiService = inject(TransactionApiService);
  private toastr: ToastrService = inject(ToastrService);

  authStore = inject(AuthStore);
  customerStore = inject(CustomerStore);
  walletStore = inject(WalletStore);
  transactionsStore = inject(TransactionsStore);

  public user = this.authStore.user;

  public customer = this.customerStore.customer;
  loadedCustomer = this.customerStore.loaded;

  public wallet = this.walletStore.wallet;
  loadedWallet = this.walletStore.loaded;

  transactions = this.transactionsStore.transactions;

  constructor(private dialog: MatDialog) {}

  openTopUpDialog() {
    const dialogRef = this.dialog.open(TopUpDialogComponent);
    dialogRef.afterClosed().subscribe((result: { amount: string }) => {
      if (!result) return;

      this.walletApiService.update(this.customer().id, {
        amount: result.amount,
      });
      this.walletStore.getWallet();
    });
  }
  openSendMoneyDialog() {
    const dialogRef = this.dialog.open(SendMoneyDialogComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      if (!this.user().emailVerified) {
        this.toastr.error('Verify your account!', 'Error!');
        return;
      }
      const sender = this.customer().id;
      if (sender && result.recipient && result.amount) {
        this.transactionApiService.sendMoney(
          sender,
          result.recipient,
          parseInt(result.amount)
        );
      }
    });
  }
}
