import { Injectable, inject } from "@angular/core"
import { type CanActivate, type ActivatedRouteSnapshot, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data["role"] as string

    if (!requiredRole) {
      return true
    }

    if (this.authService.hasRole(requiredRole)) {
      return true
    }

    // Redirect to unauthorized page or dashboard
    this.router.navigate(["home"])
    return false
  }
}
