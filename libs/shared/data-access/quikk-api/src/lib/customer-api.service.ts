import { inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Customer } from '@quikk-money/models';
import { first, firstValueFrom } from 'rxjs';
import { WalletApiService } from './wallet-api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  private db = inject(AngularFirestore);
  private walletApi = inject(WalletApiService);
  customersRef: AngularFirestoreCollection<Customer> =
    this.db.collection('/customers');

  getAll(): AngularFirestoreCollection<Customer> {
    return this.customersRef;
  }
  async getOneByUid(uid: string) {
    const snapshot = this.db
      .collection<Customer>('customers', (ref) =>
        ref.where('uid', '==', uid).limit(1)
      )
      .valueChanges();
    return await firstValueFrom(snapshot);
  }
  create(customer: Customer): any {
    const customerRef: AngularFirestoreDocument<Customer> = this.db.doc(
      `customers/${customer.uid}`
    );
    return customerRef.set(customer, {
      merge: true,
    });
  }

  update(id: string, data: any): Promise<void> {
    console.log('Customer', data);
    console.log('ID', id);
    return this.customersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.customersRef.doc(id).delete();
  }
}
