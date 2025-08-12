import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent {
  @Input() isOpen = false
  @Input() title = "Confirmar acción"
  @Input() message = "¿Estás seguro de que deseas continuar?"
  @Input() confirmText = "Confirmar"
  @Input() cancelText = "Cancelar"

  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  onConfirm(): void {
    this.confirmed.emit()
  }

  onCancel(): void {
    this.cancelled.emit()
  }
}
