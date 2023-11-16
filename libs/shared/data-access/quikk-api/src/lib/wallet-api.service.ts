import { inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Wallet } from '@quikk-money/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WalletApiService {
  private db = inject(AngularFirestore);
  private toastr: ToastrService = inject(ToastrService);
  walletsRef: AngularFirestoreCollection<Wallet> =
    this.db.collection('/wallets');

  getAll(): AngularFirestoreCollection<Wallet> {
    return this.walletsRef;
  }
  getWalletByCustomerId(customerId?: string) {
    return this.db
      .collection<Wallet>('wallets', (ref) =>
        ref.where('customer_id', '==', customerId).limit(1)
      )
      .valueChanges();
  }

  create(wallet: Wallet): any {
    return this.walletsRef.doc(wallet.customer_id).set(wallet);
  }

  update(id?: string, data?: any) {
    if (!id || !data || !data.amount) {
      console.log('wallet-api.service.ts: update() id or data.amount is null');
    }
    this.walletsRef
      .doc(id)
      .get()
      .subscribe((doc) => {
        const docData = doc.data();
        const currentBalance = docData?.balance || 0;
        const newBalance = currentBalance + data.amount;

        if (newBalance >= 0) {
          this.walletsRef
            .doc(id)
            .update({
              balance: newBalance,
            })
            .then(() => {
              this.toastr.success('Account Top Up Successfull!', 'Success!');
            })
            .catch((error) => {
              this.toastr.error('Account Top Up Failed!', 'Error!');
            });
        } else {
          console.log('wallet-api.service.ts: update() insufficient funds');
        }
      });
  }

  delete(id: string): Promise<void> {
    return this.walletsRef.doc(id).delete();
  }
}
