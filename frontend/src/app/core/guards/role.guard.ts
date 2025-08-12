import { Injectable, inject } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'])
      return false
    }

    // Obtener roles y permisos requeridos de la ruta
    const requiredRoles = route.data['roles'] as string[] || []
    const requiredPermissions = route.data['permissions'] as string[] || []

    // Si hay roles requeridos, verificar si el usuario tiene alguno
    if (requiredRoles.length > 0 && !this.authService.hasAnyRole(requiredRoles)) {
      // Usuario autenticado pero sin rol permitido
      this.router.navigate(['/panel/home'])
      return false
    }

    // Si hay permisos requeridos, verificar si el usuario tiene alguno
    if (requiredPermissions.length > 0 && !this.authService.hasAnyPermission(requiredPermissions)) {
      // Usuario autenticado pero sin permiso permitido
      this.router.navigate(['/panel/home'])
      return false
    }

    // Si pasa todas las validaciones, permitir acceso
    return true
  }
}
