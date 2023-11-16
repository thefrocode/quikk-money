import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'quikk-money-top-up-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './top-up-dialog.component.html',
  styleUrls: ['./top-up-dialog.component.css'],
})
export class TopUpDialogComponent {
  topUpForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TopUpDialogComponent>
  ) {}

  ngOnInit(): void {
    this.topUpForm = this.formBuilder.group({
      amount: ['', Validators.required],
    });
  }
  onSubmit() {
    console.log(this.topUpForm.value.amount);
    this.dialogRef.close(this.topUpForm.value);
  }
}
