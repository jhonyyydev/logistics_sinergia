import type { Routes } from "@angular/router"
import { PermissionGuard } from "../../core/guards/permission.guard"

export const DESTINATIONS_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    canActivate: [PermissionGuard],
    data: { permission: "manage-destinations" },
    loadComponent: () =>
      import("./pages/destination-list/destination-list.component").then((m) => m.DestinationListComponent),
  },
  {
    path: "create",
    canActivate: [PermissionGuard],
    data: { permission: "manage-destinations" },
    loadComponent: () =>
      import("./pages/destination-form/destination-form.component").then((m) => m.DestinationFormComponent),
  },
  {
    path: "edit/:id",
    canActivate: [PermissionGuard],
    data: { permission: "manage-destinations" },
    loadComponent: () =>
      import("./pages/destination-form/destination-form.component").then((m) => m.DestinationFormComponent),
  },
]
