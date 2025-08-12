import type { Routes } from "@angular/router"
import { AuthGuard } from "./core/guards/auth.guard"
import { GuestGuard } from "./core/guards/guest.guard"
import { LoginComponent } from "./features/auth/pages/login/login.component"
import { HomeComponent } from "./features/dashboard/pages/home/home.component"
import { ClientListComponent } from "./features/clients/pages/client-list/client-list.component"
import { DashboardComponent } from "./features/dashboard/dashboard.component"

export const routes: Routes = [
  // Ruta por defecto
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },

  // Rutas de autenticación
  {
    path: "auth",
    children: [
      {
        path: "login",
        component: LoginComponent
      }
    ]
  },

  // Rutas principales
  {
    path: "home",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
    ]
  },

  // Wildcard - debe ir al final
  {
    path: "**",
    redirectTo: "/home"
  }
]

/*
{
    path: "",
    canActivate: [AuthGuard],
    loadComponent: () => import("./features/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        loadComponent: () => import("./features/dashboard/pages/home/home.component").then((m) => m.HomeComponent),
      },
      {
        path: "products",
        loadChildren: () => import("./features/products/products.routes").then((m) => m.PRODUCTS_ROUTES),
      },
      {
        path: "clients",
        loadChildren: () => import("./features/clients/clients.routes").then((m) => m.CLIENTS_ROUTES),
      },
      {
        path: "destinations",
        loadChildren: () => import("./features/destinations/destinations.routes").then((m) => m.DESTINATIONS_ROUTES),
      },
      {
        path: "transport",
        loadChildren: () => import("./features/transport/transport.routes").then((m) => m.TRANSPORT_ROUTES),
      },
    ],
  },
  {
    path: "auth",
    canActivate: [GuestGuard],
    children: [
      {
        path: "login",
        loadComponent: () => import("./features/auth/pages/login/login.component").then((m) => m.LoginComponent),
      },
      {
        path: "register",
        loadComponent: () =>
          import("./features/auth/pages/register/register.component").then((m) => m.RegisterComponent),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
*/
