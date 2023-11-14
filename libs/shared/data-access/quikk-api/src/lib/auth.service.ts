import { Injectable, NgZone } from '@angular/core';
import { Customer, User } from '@quikk-money/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CustomerApiService } from './customer-api.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public customerApi: CustomerApiService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (result: { user: Customer }) => {
        console.log(result.user as Customer);

        if (!result.user.emailVerified) {
          window.alert('Please verify your email address. Check your inbox.');
          return;
        }
        if (result.user.uid) {
          this.customerApi.update(result.user.uid, {
            emailVerified: result.user.emailVerified,
            photoURL: result.user.photoURL,
          });
        }

        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home']);
          }
        });
      })
      .catch((error: { message: string }) => {
        window.alert(error.message);
      });
  }

  signUp(customer: Customer, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(customer.email, password)
      .then((result: { user: Customer }) => {
        this.sendVerificationMail();

        this.customerApi.create({
          ...customer,
          displayName: customer.firstName + ' ' + customer.lastName,
          uid: result.user.uid,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
        });
      })
      .catch((error: { message: string }) => {
        window.alert(error.message);
      });
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
