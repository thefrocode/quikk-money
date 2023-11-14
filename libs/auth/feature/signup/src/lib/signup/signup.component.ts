import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@quikk-money/quikk-api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'quikk-money-signup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public authService = inject(AuthService);
}
