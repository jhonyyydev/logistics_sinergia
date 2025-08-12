import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { NotificationComponent } from "../../shared/components/notification/notification.component"
import type { User } from "../../core/models/user.model"
import { Observable } from "rxjs"

@Component({
  selector: "app-panel",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.scss"],
})
export class PanelComponent {
  private authService = inject(AuthService)
  private router = inject(Router)

  currentUser$: Observable<User | null> = this.authService.currentUser$

  isMobileMenuOpen = false

  // Opciones del menú
  menuItems = [
    { label: "Inicio", path: "/panel/home" },
    { label: "Clientes", path: "/panel/client" },
    { label: "Productos", path: "/panel/product" },
    { label: "Destinos Mercancia", path: "/panel/destination" },
    { label: "Unidades de Transporte", path: "/panel/transport" },
    { label: "Entregas", path: "/panel/delivery" },
  ]

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout()
  }

  getUserInitials(name: string | undefined | null): string {
    if (!name) return "U" // Default si no hay nombre

    const parts = name.trim().split(" ")

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }

    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false
  }
}
