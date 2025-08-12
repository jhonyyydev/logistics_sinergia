import type { Routes } from "@angular/router"
import { PermissionGuard } from "../../core/guards/permission.guard"

export const TRANSPORT_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    canActivate: [PermissionGuard],
    data: { permission: "manage-transport-units" },
    loadComponent: () =>
      import("./pages/transport-list/transport-list.component").then((m) => m.TransportListComponent),
  },
  {
    path: "create",
    canActivate: [PermissionGuard],
    data: { permission: "manage-transport-units" },
    loadComponent: () =>
      import("./pages/transport-form/transport-form.component").then((m) => m.TransportFormComponent),
  },
  {
    path: "edit/:id",
    canActivate: [PermissionGuard],
    data: { permission: "manage-transport-units" },
    loadComponent: () =>
      import("./pages/transport-form/transport-form.component").then((m) => m.TransportFormComponent),
  },
]
