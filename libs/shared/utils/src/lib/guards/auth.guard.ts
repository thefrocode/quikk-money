import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthStore } from '@quikk-money/auth-store';
import { AuthService } from '@quikk-money/quikk-api';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  public authStore: AuthStore = inject(AuthStore);
  public router: Router = inject(Router);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (this.authStore.user().isLogged !== true) {
      this.router.navigate(['sign-in']);
    }
    return true;
  }
}
