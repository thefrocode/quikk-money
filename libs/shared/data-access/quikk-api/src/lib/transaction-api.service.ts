import { inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Transaction } from '@quikk-money/models';
import { ToastrService } from 'ngx-toastr';
import { from, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private db = inject(AngularFirestore);

  private toastr: ToastrService = inject(ToastrService);
  customersRef: AngularFirestoreCollection<Transaction> =
    this.db.collection('/transactions');

  sendMoney(senderId: string, recipientId: string, amount: number) {
    return from(
      this.db.firestore.runTransaction(async (transaction: any) => {
        // Get sender and recipient wallet documents
        const senderDocRef = this.db.doc(`wallets/${senderId}`).ref;
        const recipientDocRef = this.db.doc(`wallets/${recipientId}`).ref;

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

        const recipientBalance = recipientSnapshot.data()?.balance || 0;

        transaction.update(recipientDocRef, {
          balance: recipientBalance + amount,
        });

        //Add transaction record
        const transactionData = {
          sender_id: senderId,
          recipient_id: recipientId,
          amount: amount,
          timestamp: new Date(),
        };
        const transactionsCollection = this.db.collection('transactions');
        transaction.set(transactionsCollection.ref.doc(), transactionData);

        this.toastr.success('Money Sent Successfully!', 'Success!');
      })
    );
  }
  getAllTransactionsByCustomerId(customerId?: string) {
    const asSenderTransactions$ = this.db
      .collection<Transaction>('transactions', (ref) =>
        ref.where('sender_id', '==', customerId)
      )
      .valueChanges();
    const asRecipientTransactions$ = this.db
      .collection<Transaction>('transactions', (ref) =>
        ref.where('recipient_id', '==', customerId)
      )
      .valueChanges();

    return combineLatest(asSenderTransactions$, asRecipientTransactions$).pipe(
      map(([asSender, asRecipient]) => [...asSender, ...asRecipient])
    );
  }
}
