import type { Routes } from "@angular/router"
import { PermissionGuard } from "../../core/guards/permission.guard"

export const PRODUCTS_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    canActivate: [PermissionGuard],
    data: { permission: "manage-products" },
    loadComponent: () => import("./pages/product-list/product-list.component").then((m) => m.ProductListComponent),
  },
  {
    path: "create",
    canActivate: [PermissionGuard],
    data: { permission: "manage-products" },
    loadComponent: () => import("./pages/product-form/product-form.component").then((m) => m.ProductFormComponent),
  },
  {
    path: "edit/:id",
    canActivate: [PermissionGuard],
    data: { permission: "manage-products" },
    loadComponent: () => import("./pages/product-form/product-form.component").then((m) => m.ProductFormComponent),
  },
]
