import { effect, Injectable, NgZone, signal } from '@angular/core';
import { Customer, CustomerState, User, UserState } from '@quikk-money/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CustomerApiService } from './customer-api.service';
import { Subject, takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { AuthStore } from '@quikk-money/auth-store';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public customerApi: CustomerApiService,
    public authStore: AuthStore,
    private toastr: ToastrService
  ) {
    this.afAuth.authState.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (value) => {
        console.log('Subscription ', value);
        if (value && value.email) {
          this.authStore.setUser({
            value: {
              email: value?.email,
              emailVerified: value?.emailVerified,
              uid: value?.uid,
            },
            status: 'success',
            isLogged: true,
          });
          this.router.navigate(['home']);
        } else {
          this.authStore.setUser({
            value: {},
            status: 'success',
            isLogged: false,
          });
          this.authStore.setCustomer({
            value: {},
            status: 'success',
          });
          return;
        }
      },
      error: (error) => this.authStore.updateUser(error, 'error'),
    });
  }
  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .catch((error: { message: string }) => {
        window.alert(error.message);
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
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
