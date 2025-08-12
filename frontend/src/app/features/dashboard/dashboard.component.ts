import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { NotificationComponent } from "../../shared/components/notification/notification.component"
import type { User } from "../../core/models/user.model"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)

  currentUser: User | null = null
  isMobileMenuOpen = false

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.authService.logout()
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission)
  }

  getNavigationItems() {
    const items = []

    if (this.hasPermission("manage-clients")) {
      items.push({
        label: "Clients",
        route: "/dashboard/clients",
        permission: "manage-clients",
      })
    }

    if (this.hasPermission("manage-products")) {
      items.push({
        label: "Products",
        route: "/dashboard/products",
        permission: "manage-products",
      })
    }

    if (this.hasPermission("manage-destinations")) {
      items.push({
        label: "Destinations",
        route: "/dashboard/destinations",
        permission: "manage-destinations",
      })
    }

    if (this.hasPermission("manage-transport-units")) {
      items.push({
        label: "Transport",
        route: "/dashboard/transport",
        permission: "manage-transport-units",
      })
    }

    if (this.hasPermission("manage-deliveries")) {
      items.push({
        label: "Deliveries",
        route: "/dashboard/deliveries",
        permission: "manage-deliveries",
      })
    }

    return items
  }
}
