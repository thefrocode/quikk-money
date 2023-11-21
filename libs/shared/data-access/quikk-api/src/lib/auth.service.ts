import { computed, inject, Injectable, signal } from '@angular/core';
import { Customer, User, UserState } from '@quikk-money/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CustomerApiService } from './customer-api.service';

import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public customerApi: CustomerApiService,
    private toastr: ToastrService
  ) {}
  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .catch((error: { message: string }) => {
        this.toastr.error(error.message, 'Error Signing In!');
      });
  }

  signUp(customer: Customer, email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result: any) => {
        this.toastr.success('You have successfully signed up!', 'Success!');
        this.sendVerificationMail();
        this.customerApi.create({
          ...customer,
          uid: result.user.uid,
        });
      })
      .catch((error: { message: string }) => {
        this.toastr.error('Error signing Up!' + error.message, 'Error!');
      });
  }

  sendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['sign-in']);
    });
  }
}
