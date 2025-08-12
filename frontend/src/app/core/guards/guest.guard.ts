import { Injectable, inject } from "@angular/core"
import { type CanActivate, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class GuestGuard implements CanActivate {
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true
    }

    this.router.navigate(["home"])
    return false
  }
}
