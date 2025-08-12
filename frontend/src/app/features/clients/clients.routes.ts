import type { Routes } from "@angular/router"
import { PermissionGuard } from "../../core/guards/permission.guard"

export const CLIENTS_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    canActivate: [PermissionGuard],
    data: { permission: "manage-clients" },
    loadComponent: () => import("./pages/client-list/client-list.component").then((m) => m.ClientListComponent),
  },
  {
    path: "edit/:id",
    canActivate: [PermissionGuard],
    data: { permission: "manage-clients" },
    loadComponent: () => import("./pages/client-form/client-form.component").then((m) => m.ClientFormComponent),
  },
]
