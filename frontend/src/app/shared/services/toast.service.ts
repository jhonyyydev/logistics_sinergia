import { Injectable, signal } from "@angular/core"

export interface Toast {
  id: string
  title: string
  description?: string
  variant: "success" | "error" | "warning" | "info"
  duration?: number
}

interface InternalToast extends Omit<Toast, "duration"> {
  duration: number
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toasts = signal<InternalToast[]>([])

  getToasts = this.toasts.asReadonly()

  show(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration ?? 5000 // Extraer duration explícitamente

    const newToast: InternalToast = {
      ...toast,
      id,
      duration, // Usar la variable extraída
    }

    this.toasts.update((toasts) => [...toasts, newToast])

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration) // Usar la variable duration en lugar de newToast.duration
    }
  }

  success(title: string, description?: string) {
    this.show({ title, description, variant: "success" })
  }

  error(title: string, description?: string) {
    this.show({ title, description, variant: "error" })
  }

  warning(title: string, description?: string) {
    this.show({ title, description, variant: "warning" })
  }

  info(title: string, description?: string) {
    this.show({ title, description, variant: "info" })
  }

  remove(id: string) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id))
  }

  clear() {
    this.toasts.set([])
  }
}
