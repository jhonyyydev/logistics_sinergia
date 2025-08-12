import { CanActivate, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { inject, Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'])
      return false
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/unauthorized'])
      return false
    }

    return true
  }
}
