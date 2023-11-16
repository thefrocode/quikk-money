import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { importProvidersFrom } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      BrowserAnimationsModule
    ),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    provideAnimations(),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
};
