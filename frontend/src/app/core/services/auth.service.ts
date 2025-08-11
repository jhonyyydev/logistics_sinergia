import { Injectable, inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthTokenService } from "./auth-token.service"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly tokenService = inject(AuthTokenService)
  private readonly router = inject(Router)

  login(token: string, permissions: string[] = []): void {
    this.tokenService.setToken(token)
    localStorage.setItem("user_permissions", JSON.stringify(permissions))
  }

  logout(): void {
    this.tokenService.removeToken()
    localStorage.removeItem("user_permissions")
    this.router.navigateByUrl("/auth/login")
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated()
  }

  getToken(): string | null {
    return this.tokenService.getToken()
  }

  getUserPermissions(): string[] {
    const permissions = localStorage.getItem("user_permissions")
    return permissions ? JSON.parse(permissions) : []
  }

  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission)
  }

  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions()
    return permissions.some((permission) => userPermissions.includes(permission))
  }

  isAdmin(): boolean {
    const permissions = this.getUserPermissions()
    return (
      permissions.includes("manage-clients") &&
      permissions.includes("manage-products") &&
      permissions.includes("manage-destinations") &&
      permissions.includes("manage-transport-units")
    )
  }

  isClient(): boolean {
    const permissions = this.getUserPermissions()
    return permissions.includes("manage-deliveries") && permissions.length === 1
  }
}
