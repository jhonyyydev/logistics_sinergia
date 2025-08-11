import { Injectable, inject } from "@angular/core"
import { AuthTokenService } from "./auth-token.service"

export interface UserPermissions {
  canViewClients: boolean
  canEditClients: boolean
  canViewProducts: boolean
  canEditProducts: boolean
  canViewDeliveries: boolean
  canEditDeliveries: boolean
  canViewDestinations: boolean
  canEditDestinations: boolean
  canViewTransportUnits: boolean
  canEditTransportUnits: boolean
}

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private readonly tokenService = inject(AuthTokenService)

  getUserPermissions(): UserPermissions {
    const token = this.tokenService.getToken()
    if (!token) {
      return this.getDefaultPermissions()
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.permissions || this.getDefaultPermissions()
    } catch {
      return this.getDefaultPermissions()
    }
  }

  private getDefaultPermissions(): UserPermissions {
    return {
      canViewClients: true,
      canEditClients: false,
      canViewProducts: true,
      canEditProducts: false,
      canViewDeliveries: true,
      canEditDeliveries: false,
      canViewDestinations: true,
      canEditDestinations: false,
      canViewTransportUnits: true,
      canEditTransportUnits: false,
    }
  }

  hasPermission(permission: keyof UserPermissions): boolean {
    const permissions = this.getUserPermissions()
    return permissions[permission]
  }
}
