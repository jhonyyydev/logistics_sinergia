import type { Routes } from "@angular/router"

// Auth Components
import { LoginComponent } from "./features/auth/login/login.component"
import { RegisterComponent } from "./features/auth/register/register.component"

// Dashboard Components
import { PanelComponent } from "./features/panel/panel.component"
import { HomeComponent } from "./features/panel/home/home.component"

// Feature Components
import { ClientListComponent } from "./features/panel/clients/client-list/client-list.component"
import { ProductListComponent } from "./features/panel/products/product-list/product-list.component"
import { DestinationListComponent } from "./features/panel/destinations//destination-list/destination-list.component"
import { TransportListComponent } from "./features/panel/transports/transport-list/transport-list.component"
import { DeliveriesComponent } from "./features/panel/deliveries/deliveries.component"
import { RoleGuard } from "./core/guards/role.guard"
import { CreateDeliveryComponent } from "./features/panel/create-delivery/create-delivery.component"

export const routes: Routes = [
  // Ruta raíz - redirige a panel
  {
    path: "",
    redirectTo: "/panel",
    pathMatch: "full"
  },

  // Rutas de autenticación
  {
    path: "auth",
    children: [
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "register",
        component: RegisterComponent
      }
    ]
  },

  // Panel principal con DashboardComponent como wrapper
  {
    path: "panel",
    component: PanelComponent,
    children: [
      // Redirect automático de /panel a /panel/home
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },

      // Página principal del panel
      {
        path: "home",
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'client'] }
      },

      // Módulos del panel
      {
        path: "client",
        component: ClientListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: "product",
        component: ProductListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: "destination",
        component: DestinationListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: "transport",
        component: TransportListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: "delivery",
        component: DeliveriesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: "create-delivery",
        component: CreateDeliveryComponent,
        canActivate: [RoleGuard],
        data: { roles: ['client'] }
      }
    ]
  },

  // Wildcard - redirige a panel si no encuentra la ruta
  {
    path: "**",
    redirectTo: "/panel"
  }
]
