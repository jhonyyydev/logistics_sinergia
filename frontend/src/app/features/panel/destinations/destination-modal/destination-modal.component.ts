
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import type { Destination, DestinationFormData, DestinationType } from '@/core/models/destination.model'
import { DESTINATION_TYPES, DESTINATION_TYPE_LABELS } from '@/core/models/destination.model'

export interface DestinationSaveEvent {
  destination: DestinationFormData
  isEdit: boolean
}

@Component({
  selector: 'app-destination-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './destination-modal.component.html',
  styleUrl: './destination-modal.component.scss'
})
export class DestinationModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() destination: Destination | null = null
  @Input() isLoading = false
  @Input() errorMessage = ''

  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<DestinationSaveEvent>()

  destinationForm!: FormGroup
  isEditMode = false

  // Expose constants to template
  readonly DESTINATION_TYPES = DESTINATION_TYPES
  readonly DESTINATION_TYPE_LABELS = DESTINATION_TYPE_LABELS

  constructor(private fb: FormBuilder) {
    this.initForm()
  }

  ngOnInit(): void {
    this.initForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['destination'] && this.destination) {
      this.isEditMode = true
      this.loadDestinationData()
    } else if (changes['isOpen'] && this.isOpen && !this.destination) {
      this.isEditMode = false
      this.resetForm()
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.destinationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
      destination_type: ['', [Validators.required, this.validateDestinationType]]
    })
  }

  /**
   * Validador personalizado para tipo de destino
   */
  private validateDestinationType(control: any) {
    const validTypes = [DESTINATION_TYPES.SEAPORT, DESTINATION_TYPES.WAREHOUSE_LAND]
    return validTypes.includes(control.value) ? null : { invalidType: true }
  }

  /**
   * Cargar datos del destino en el formulario
   */
  private loadDestinationData(): void {
    if (this.destination) {
      this.destinationForm.patchValue({
        name: this.destination.name,
        location: this.destination.location,
        capacity: this.destination.capacity,
        destination_type: this.destination.type
      })
    }
  }

  /**
   * Resetear formulario
   */
  private resetForm(): void {
    this.destinationForm.reset()
  }

  /**
   * Manejar envío del formulario
   */
  onSubmit(): void {
    if (this.destinationForm.valid && !this.isLoading) {
      const formValue = this.destinationForm.value

      const destinationData: DestinationFormData = {
        name: formValue.name.trim(),
        location: formValue.location.trim(),
        capacity: Number(formValue.capacity),
        type: formValue.destination_type as DestinationType
      }

      this.save.emit({
        destination: destinationData,
        isEdit: this.isEditMode
      })
    }
  }

  /**
   * Cerrar modal
   */
  onClose(): void {
    this.close.emit()
  }

  /**
   * Manejar click en backdrop
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose()
    }
  }

  /**
   * Obtener error de campo
   */
  getFieldError(fieldName: string): string {
    const field = this.destinationForm.get(fieldName)

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido'
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`
      if (field.errors['invalidType']) return 'Selecciona un tipo válido'
    }
    return ''
  }
}
