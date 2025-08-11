import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterOutlet } from "@angular/router"
import { AuthService } from "@/core/services/auth.service"
import { HlmButton } from "@spartan-ng/helm/button"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HlmButton],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  userEmail = ""
  currentTime = new Date()
  availableSections: Array<{
    key: string
    name: string
    description: string
    color: string
    permission: string
  }> = []

  ngOnInit(): void {
    this.updateCurrentTime()
    this.loadAvailableSections()
    // Actualizar la hora cada minuto
    setInterval(() => {
      this.updateCurrentTime()
    }, 60000)
  }

  private updateCurrentTime(): void {
    this.currentTime = new Date()
  }

  private loadAvailableSections(): void {
    const allSections = [
      {
        key: "clients",
        name: "Clients",
        description: "Manage your clients",
        color: "blue",
        permission: "manage-clients",
      },
      {
        key: "products",
        name: "Products",
        description: "Manage your products",
        color: "green",
        permission: "manage-products",
      },
      {
        key: "deliveries",
        name: "Deliveries",
        description: "Track deliveries",
        color: "yellow",
        permission: "manage-deliveries",
      },
      {
        key: "destinations",
        name: "Destinations",
        description: "Manage destinations",
        color: "purple",
        permission: "manage-destinations",
      },
      {
        key: "transport-units",
        name: "Transport Units",
        description: "Manage transport units",
        color: "red",
        permission: "manage-transport-units",
      },
    ]

    this.availableSections = allSections.filter((section) => this.authService.hasPermission(section.permission))
  }

  logout(): void {
    this.authService.logout()
  }

  navigateToSection(section: string): void {
    this.router.navigate(["/dashboard", section])
  }

  getSectionColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-50 hover:bg-blue-100",
      green: "bg-green-50 hover:bg-green-100",
      yellow: "bg-yellow-50 hover:bg-yellow-100",
      purple: "bg-purple-50 hover:bg-purple-100",
      red: "bg-red-50 hover:bg-red-100",
    }
    return colorMap[color] || "bg-gray-50 hover:bg-gray-100"
  }

  getIconColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
    }
    return colorMap[color] || "bg-gray-500"
  }
}
