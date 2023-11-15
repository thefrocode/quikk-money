import { inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Wallet } from '@quikk-money/models';

@Injectable({
  providedIn: 'root',
})
export class WalletApiService {
  private db = inject(AngularFirestore);
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

  update(id?: string, data?: any): Promise<void> {
    console.log('wallet-api.service.ts: update()', id, data);
    if (id) {
      return this.walletsRef.doc(id).update(data);
    }
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    return this.walletsRef.doc(id).delete();
  }
}
