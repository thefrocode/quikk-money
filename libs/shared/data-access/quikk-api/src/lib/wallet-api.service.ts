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
  create(wallet: Wallet): any {
    console.log(wallet);
    return this.walletsRef.add({ ...wallet }).then((res) => {
      console.log(res);
    });
  }

  update(id: string, data: any): Promise<void> {
    return this.walletsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.walletsRef.doc(id).delete();
  }
}
