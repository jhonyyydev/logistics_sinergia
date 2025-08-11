import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class AuthTokenService {
  private readonly TOKEN_KEY = "auth_token"

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
    }
  }

  clearToken(): void {
    this.removeToken()
  }

  hasToken(): boolean {
    return this.getToken() !== null
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    if (token.split(".").length !== 3) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return false;
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }


  isAuthenticated(): boolean {
    return this.hasToken() && !this.isTokenExpired()
  }
}
