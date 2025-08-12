import { Injectable, inject } from "@angular/core"
import { type CanActivate, type ActivatedRouteSnapshot, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data["permission"] as string

    if (!requiredPermission) {
      return true
    }

    if (this.authService.hasPermission(requiredPermission)) {
      return true
    }

    this.router.navigate(["home"])
    return false
  }
}
