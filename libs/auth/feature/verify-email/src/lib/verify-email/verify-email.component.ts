import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@quikk-money/quikk-api';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'quikk-money-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  public authService = inject(AuthService);
}
