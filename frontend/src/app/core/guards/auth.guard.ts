import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
/*   const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está logueado, redirige al login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false; */
    // Simulación: aquí obtendrías el usuario desde un servicio de auth o storage
  const user = {
    role: 'admin' // O 'client'
  };

  if (user.role === 'admin') {
    console.log('Usuario es admin');
  } else if (user.role === 'client') {
    console.log('Usuario es client');
  } else {
    console.log('Usuario sin rol válido');
  }

  // Por ahora dejamos que siempre pase
  return true;
};
