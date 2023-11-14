import { Route } from '@angular/router';
import { SigninComponent } from '@quikk-money/signin';
import { SignupComponent } from '@quikk-money/signup';
import { HomeComponent } from '@quikk-money/home';
import { VerifyEmailComponent } from '@quikk-money/verify-email';
import { AuthGuard } from '@quikk-money/utils';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
];
