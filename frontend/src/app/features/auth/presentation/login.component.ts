import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthHttpRepository } from '../infrastructure/auth-http.repository';
import { AuthTokenService } from '@/core/services/auth-token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-80">
      <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
      <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  private readonly authRepo = inject(AuthHttpRepository);
  private readonly tokenService = inject(AuthTokenService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  onSubmit() {
    this.authRepo.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.tokenService.setToken(res.token);
        this.router.navigateByUrl('/');
      }
    });
  }
}
