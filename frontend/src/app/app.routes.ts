import type { Routes } from "@angular/router"
import { AuthGuard } from "./core/guards/auth.guard"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "./core/services/auth.service"

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "auth/dashboard",
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/presentation/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./features/dashboard/presentation/dashboard/dashboard.routes").then((m) => m.dashboardRoutes),
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
]
