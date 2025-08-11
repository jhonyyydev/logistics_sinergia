import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ToastService } from "../../services/toast.service"
import { ToastComponent } from "./toast.component"

@Component({
  selector: "app-toast-container",
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <app-toast
        *ngFor="let toast of toastService.getToasts(); trackBy: trackByToastId"
        [toast]="toast"
        (onClose)="toastService.remove(toast.id)"
      />
    </div>
  `,
})
export class ToastContainerComponent {
  toastService = inject(ToastService)

  trackByToastId(index: number, toast: any) {
    return toast.id
  }
}
