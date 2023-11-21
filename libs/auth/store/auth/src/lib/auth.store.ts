import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserState } from '@quikk-money/models';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  afs = inject(AngularFirestore);
  afAuth = inject(AngularFireAuth);
  router = inject(Router);
  private state = signal<UserState>({
    value: {
      email: null,
      emailVerified: false,
      uid: null,
      displayName: null,
    },
    loaded: false,
    isLogged: false,
  });

  user = computed(() => this.state().value);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);
  isLogged = computed(() => this.state().isLogged);

  constructor() {
    this.afAuth.authState.pipe(takeUntilDestroyed()).subscribe((user: any) => {
      if (user) {
        this.state.update((s) => {
          return {
            ...s,
            value: {
              email: user?.email,
              emailVerified: user?.emailVerified,
              uid: user?.uid,
              displayName: user?.displayName,
            },
            loaded: true,
            isLogged: true,
          };
        });
        this.router.navigate(['home']);
      } else {
        this.state.update(() => {
          return {
            value: {
              email: null,
              emailVerified: false,
              uid: null,
              displayName: null,
            },
            loaded: true,
            isLogged: false,
          };
        });
        this.router.navigate(['sign-in']);
      }
    });
  }
}
