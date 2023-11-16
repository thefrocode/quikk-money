import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixMagnifyingGlass } from '@ng-icons/radix-icons';
import { CustomerApiService } from '@quikk-money/quikk-api';
import { Customer } from '@quikk-money/models';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'quikk-money-send-money-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmIconComponent],
  providers: [
    provideIcons({
      radixMagnifyingGlass,
    }),
  ],
  templateUrl: './send-money-dialog.component.html',
  styleUrls: ['./send-money-dialog.component.css'],
})
export class SendMoneyDialogComponent {
  sendMoneyForm!: FormGroup;
  recipient = signal<Customer>({});

  constructor(
    private formBuilder: FormBuilder,
    private customerApiService: CustomerApiService,
    public dialogRef: MatDialogRef<SendMoneyDialogComponent>
  ) {}

  ngOnInit(): void {
    this.sendMoneyForm = this.formBuilder.group({
      amount: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });
  }
  searchCustomer(phoneNumber: string) {
    this.customerApiService
      .getOneByPhone(phoneNumber)
      .subscribe((customer: any) => {
        if (customer.length != 0) {
          this.recipient.set(customer[0]);
        } else {
          this.recipient.set({});
        }
      });
  }
  onSubmit() {
    if (this.recipient().id === undefined) {
      return;
    }
    this.dialogRef.close({
      recipient: this.recipient().id,
      amount: this.sendMoneyForm.value.amount,
    });
  }
}
