import { inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Transaction } from '@quikk-money/models';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private db = inject(AngularFirestore);
  customersRef: AngularFirestoreCollection<Transaction> =
    this.db.collection('/transactions');
  sendMoney(senderId: string, recipientId: string, amount: number) {
    return from(
      this.db.firestore.runTransaction(async (transaction: any) => {
        // Get sender and recipient wallet documents
        const senderDocRef: DocumentReference = this.db.doc(
          `wallets/${senderId}`
        ).ref;
        const recipientDocRef: DocumentReference = this.db.doc(
          `wallets/${recipientId}`
        ).ref;

        // Retrieve wallet data in the transaction
        const [senderSnapshot, recipientSnapshot] = await Promise.all([
          transaction.get(senderDocRef),
          transaction.get(recipientDocRef),
        ]);

        // Check if the sender has enough balance
        const senderBalance = senderSnapshot.data()?.balance || 0;
        if (senderBalance < amount) {
          throw new Error('Insufficient funds');
        }

        // Update sender's balance
        transaction.update(senderDocRef, { balance: senderBalance - amount });

        // Update recipient's balance
        const recipientBalance = recipientSnapshot.data()?.balance || 0;
        transaction.update(recipientDocRef, {
          balance: recipientBalance + amount,
        });

        // Add transaction record
        const transactionData = {
          sender_id: senderId,
          recipient_id: recipientId,
          amount: amount,
          timestamp: new Date(),
        };
        const transactionsCollection = this.db.collection('transactions');
        transaction.set(transactionsCollection.ref.doc(), transactionData);
      })
    );
  }
}