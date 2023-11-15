import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@quikk-money/quikk-api';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@quikk-money/auth-store';

@Component({
  selector: 'quikk-money-signin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  public authService = inject(AuthService);

  //public authStore = inject(AuthStore);

  //public user = this.authStore.user;
}
