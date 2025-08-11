import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service'; // ajusta si la ruta es distinta

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: class { }, // componente dummy vacío
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);

      if (authService.isLoggedIn()) {
        router.navigate(['/dashboard']);
      } else {
        router.navigate(['/auth/login']);
      }
      return false;
    }]
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/presentation/dashboard/dashboard.routes')
        .then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/presentation/auth.routes')
        .then(m => m.AUTH_ROUTES)
  }
];
