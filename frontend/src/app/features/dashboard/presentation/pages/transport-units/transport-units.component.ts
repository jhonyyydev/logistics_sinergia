import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-transport-units",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Transport Units Management</h2>
      <p class="text-gray-600">Transport units management functionality will be implemented here.</p>
    </div>
  `,
})
export class TransportUnitsComponent {}
