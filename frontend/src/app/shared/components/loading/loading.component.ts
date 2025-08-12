import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-loading",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Cargando...</span>
    </div>
  `,
})
export class LoadingComponent {}
