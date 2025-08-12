import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([])
  public notifications$ = this.notificationsSubject.asObservable()

  showSuccess(message: string, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: "success",
      message,
      duration,
    })
  }

  showError(message: string, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: "error",
      message,
      duration,
    })
  }

  showWarning(message: string, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: "warning",
      message,
      duration,
    })
  }

  showInfo(message: string, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: "info",
      message,
      duration,
    })
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value
    const updatedNotifications = currentNotifications.filter((n) => n.id !== id)
    this.notificationsSubject.next(updatedNotifications)
  }

  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value
    this.notificationsSubject.next([...currentNotifications, notification])

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id)
      }, notification.duration)
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}
