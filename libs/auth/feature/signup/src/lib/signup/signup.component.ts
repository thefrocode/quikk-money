import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@quikk-money/quikk-api';
import { RouterModule } from '@angular/router';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'quikk-money-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HlmInputDirective],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  submittedForm = false;
  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.min(1000000000)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    this.submittedForm = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.authService.signUp(
      {
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        phoneNumber: this.signupForm.value.phoneNumber,
      },
      this.signupForm.value.email,
      this.signupForm.value.password
    );
  }
  get f() {
    return this.signupForm.controls;
  }
}
