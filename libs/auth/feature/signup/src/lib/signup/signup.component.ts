import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@quikk-money/quikk-api';
import { RouterModule } from '@angular/router';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { PasswordValidator } from '@quikk-money/utils';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  toastr = inject(ToastrService);
  submittedForm = false;
  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        firstName: ['aa', [Validators.required]],
        lastName: ['aa', [Validators.required]],
        phoneNumber: [
          '1111111111',
          [Validators.required, Validators.min(1000000000)],
        ],
        email: [
          'krystinmukiri@gmail.com',
          [Validators.required, Validators.email],
        ],
        password: ['123456', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['123456', [Validators.required]],
      },
      {
        validator: PasswordValidator.MatchValidator(
          'password',
          'confirm_password'
        ),
      }
    );
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
