import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p class="mt-2">Aquí irá el contenido principal.</p>
    </div>
  `
})
export class DashboardComponent {}
