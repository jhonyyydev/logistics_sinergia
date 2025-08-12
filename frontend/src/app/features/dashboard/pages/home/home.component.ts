import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../../../core/services/auth.service"
import type { User } from "../../../../core/models/user.model"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService)
  currentUser: User | null = null

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  getAvailableModules() {
    const modules = []

    if (this.authService.hasPermission("manage-clients")) {
      modules.push({
        name: "Gestión de Clientes",
        description: "Administra la información de los clientes",
        route: "/dashboard/clients",
        icon: "users",
        color: "bg-blue-500",
      })
    }

    if (this.authService.hasPermission("manage-products")) {
      modules.push({
        name: "Gestión de Productos",
        description: "Administra el catálogo de productos",
        route: "/dashboard/products",
        icon: "package",
        color: "bg-green-500",
      })
    }

    if (this.authService.hasPermission("manage-destinations")) {
      modules.push({
        name: "Gestión de Destinos",
        description: "Administra los destinos de envío",
        route: "/dashboard/destinations",
        icon: "map-pin",
        color: "bg-purple-500",
      })
    }

    if (this.authService.hasPermission("manage-transport-units")) {
      modules.push({
        name: "Unidades de Transporte",
        description: "Administra la flota de transporte",
        route: "/dashboard/transport",
        icon: "truck",
        color: "bg-orange-500",
      })
    }

    if (this.authService.hasPermission("manage-deliveries")) {
      modules.push({
        name: "Gestión de Entregas",
        description: "Administra las entregas y envíos",
        route: "/dashboard/deliveries",
        icon: "clipboard-check",
        color: "bg-red-500",
      })
    }

    return modules
  }
}
