import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private permissionsKey = 'user_permissions';

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(token: string, permissions: string[]): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.permissionsKey, JSON.stringify(permissions));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.permissionsKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserPermissions(): string[] {
    const perms = localStorage.getItem(this.permissionsKey);
    return perms ? JSON.parse(perms) : [];
  }
}
