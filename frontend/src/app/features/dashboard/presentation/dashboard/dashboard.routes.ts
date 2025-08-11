import type { Routes } from "@angular/router"
import { HomeComponent } from "./home/home.component"
import { roleGuard } from "@/core/guards/role.guard"

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "clients",
        canActivate: [roleGuard],
        data: { permission: "manage-clients" },
        loadComponent: () => import("../pages/clients/clients.component").then((m) => m.ClientsComponent),
      },
      {
        path: "products",
        canActivate: [roleGuard],
        data: { permission: "manage-products" },
        loadComponent: () => import("../pages/products/products.component").then((m) => m.ProductsComponent),
      },
      {
        path: "deliveries",
        canActivate: [roleGuard],
        data: { permission: "manage-deliveries" },
        loadComponent: () => import("../pages/deliveries/deliveries.component").then((m) => m.DeliveriesComponent),
      },
      {
        path: "destinations",
        canActivate: [roleGuard],
        data: { permission: "manage-destinations" },
        loadComponent: () =>
          import("../pages/destinations/destinations.component").then((m) => m.DestinationsComponent),
      },
      {
        path: "transport-units",
        canActivate: [roleGuard],
        data: { permission: "manage-transport-units" },
        loadComponent: () =>
          import("../pages/transport-units/transport-units.component").then((m) => m.TransportUnitsComponent),
      },
      {
        path: "",
        redirectTo: "",
        pathMatch: "full",
      },
    ],
  },
]
