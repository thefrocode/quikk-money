import { inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Customer } from '@quikk-money/models';

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
  getOneByUid(uid?: string) {
    return this.db
      .collection<Customer>('customers', (ref) =>
        ref.where('uid', '==', uid).limit(1)
      )
      .valueChanges();
  }
  getOneByPhone(phoneNumber: string) {
    return this.db
      .collection<Customer>('customers', (ref) =>
        ref.where('phoneNumber', '==', phoneNumber).limit(1)
      )
      .valueChanges();
  }

  create(customer: Customer): any {
    return this.customersRef.add(customer).then((docRef) => {
      const customerId = docRef.id;

      // Add the document ID to the customer data
      const customerWithId = { ...customer, id: customerId };

      // Update the customer document with the added ID
      docRef.update({ id: customerId });

      // Create the wallet using the customer ID
      this.walletApi.create({
        customer_id: customerId,
        balance: 0,
      });
    });
  }

  update(id: string, data: any): Promise<void> {
    return this.customersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.customersRef.doc(id).delete();
  }
}
