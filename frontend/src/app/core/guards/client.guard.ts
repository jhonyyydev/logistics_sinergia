import { inject, Injectable } from "@angular/core"
import { CanActivate, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'])
      return false
    }

    if (!this.authService.isClient()) {
      this.router.navigate(['/unauthorized'])
      return false
    }

    return true
  }
}
