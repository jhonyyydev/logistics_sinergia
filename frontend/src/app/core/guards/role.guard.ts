import { inject } from "@angular/core"
import { type CanActivateFn, Router, type ActivatedRouteSnapshot } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const requiredPermission = route.data["permission"]
  const hasPermission = authService.hasPermission(requiredPermission)

  if (!hasPermission) {
    router.navigate(["/dashboard"])
    return false
  }

  return true
}
