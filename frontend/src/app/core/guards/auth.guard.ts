import { Injectable, inject } from "@angular/core"
import { type CanActivate, Router } from "@angular/router"
import { AuthTokenService } from "../services/auth-token.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  private readonly tokenService = inject(AuthTokenService)
  private readonly router = inject(Router)

  canActivate(): boolean {
    if (this.tokenService.isAuthenticated()) {
      return true
    }

    this.router.navigateByUrl("/auth/login")
    return false
  }
}
