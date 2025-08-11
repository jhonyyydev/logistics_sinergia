import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HlmButton } from "@spartan-ng/helm/button"
import type { Toast } from "../../services/toast.service"

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule, HlmButton],
  template: `
    <div
      class="fixed top-4 right-4 z-50 w-full max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out"
      [ngClass]="{
        'bg-green-50 border-green-200 text-green-800': toast.variant === 'success',
        'bg-red-50 border-red-200 text-red-800': toast.variant === 'error',
        'bg-yellow-50 border-yellow-200 text-yellow-800': toast.variant === 'warning',
        'bg-blue-50 border-blue-200 text-blue-800': toast.variant === 'info'
      }"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="font-medium text-sm">{{ toast.title }}</h4>
          <p *ngIf="toast.description" class="text-sm mt-1 opacity-90">
            {{ toast.description }}
          </p>
        </div>
        <button
          hlmBtn
          variant="ghost"
          size="sm"
          class="ml-2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
          (click)="onClose.emit()"
        >
          ×
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent {
  @Input({ required: true }) toast!: Toast
  @Output() onClose = new EventEmitter<void>()
}
