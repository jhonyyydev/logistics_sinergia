import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms'
import type { Transport, TransportFormData, TransportUnitType } from '@/core/models/transport.model'
import {
  TRANSPORT_UNIT_TYPES,
  TRANSPORT_UNIT_TYPE_LABELS,
  TRANSPORT_FORMATS,
  TRANSPORT_FORMAT_HELP
} from '@/core/models/transport.model'

// Interface para el evento de guardar
export interface TransportSaveEvent {
  transport: TransportFormData
  isEdit: boolean
}

@Component({
  selector: 'app-transport-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transport-modal.component.html',
  styleUrl: './transport-modal.component.scss'
})
export class TransportModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() transport: Transport | null = null
  @Input() isLoading = false
  @Input() errorMessage = ''

  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<TransportSaveEvent>()

  transportForm!: FormGroup
  isEditMode = false
  selectedUnitType: TransportUnitType | null = null

  // Expose constants to template
  readonly TRANSPORT_UNIT_TYPES = TRANSPORT_UNIT_TYPES
  readonly TRANSPORT_UNIT_TYPE_LABELS = TRANSPORT_UNIT_TYPE_LABELS

  constructor(private fb: FormBuilder) {
    this.initForm()
  }

  ngOnInit(): void {
    this.initForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transport'] && this.transport) {
      this.isEditMode = true
      this.loadTransportData()
    } else if (changes['isOpen'] && this.isOpen && !this.transport) {
      this.isEditMode = false
      this.resetForm()
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.transportForm = this.fb.group({
      unit_type: ['', [Validators.required, this.validateUnitType]],
      identifier: [{value: '', disabled: true}, [Validators.required, this.validateIdentifierFormat.bind(this)]],
      active: [true] // Default to true
    })
  }

  /**
   * Validador personalizado para tipo de unidad
   */
  private validateUnitType(control: AbstractControl) {
    const validTypes = [TRANSPORT_UNIT_TYPES.VEHICLE, TRANSPORT_UNIT_TYPES.FLEET]
    return validTypes.includes(control.value) ? null : { invalidType: true }
  }

  /**
   * Validador personalizado para formato de identificador
   */
  private validateIdentifierFormat(control: AbstractControl) {
    if (!control.value || !this.selectedUnitType) {
      return null // No validar si no hay valor o tipo
    }

    const identifier = control.value.toString().toUpperCase()

    if (this.selectedUnitType === 'vehicle') {
      return TRANSPORT_FORMATS.VEHICLE.test(identifier) ? null : { invalidVehicleFormat: true }
    } else if (this.selectedUnitType === 'fleet') {
      return TRANSPORT_FORMATS.FLEET.test(identifier) ? null : { invalidFleetFormat: true }
    }

    return null
  }

  /**
   * Manejar cambio de tipo de unidad
   */
  onUnitTypeChange(): void {
    const unitType = this.transportForm.get('unit_type')?.value
    this.selectedUnitType = unitType || null

    const identifierControl = this.transportForm.get('identifier')

    if (unitType) {
      // Habilitar campo identifier
      identifierControl?.enable()
      // Limpiar valor anterior
      identifierControl?.setValue('')
    } else {
      // Deshabilitar campo identifier
      identifierControl?.disable()
      identifierControl?.setValue('')
    }

    // Revalidar el campo identifier
    identifierControl?.updateValueAndValidity()
  }

  /**
   * Manejar input en el campo identifier
   */
  onIdentifierInput(event: Event): void {
    const target = event.target as HTMLInputElement
    const value = target.value.toUpperCase()

    // Actualizar el valor en mayúsculas
    this.transportForm.get('identifier')?.setValue(value, { emitEvent: false })
  }

  /**
   * Cargar datos del transporte en el formulario
   */
  private loadTransportData(): void {
    if (this.transport) {
      this.selectedUnitType = this.transport.type

      this.transportForm.patchValue({
        unit_type: this.transport.type,
        identifier: this.transport.identifier,
        active: this.transport.active
      })

      // Habilitar campo identifier
      this.transportForm.get('identifier')?.enable()
    }
  }

  /**
   * Resetear formulario
   */
  private resetForm(): void {
    this.selectedUnitType = null
    this.transportForm.reset({ active: true })
    this.transportForm.get('identifier')?.disable()
  }

  /**
   * Manejar envío del formulario
   */
  onSubmit(): void {
    if (this.transportForm.valid && !this.isLoading) {
      const formValue = this.transportForm.value

      const transportData: TransportFormData = {
        identifier: formValue.identifier.trim().toUpperCase(),
        type: formValue.unit_type as TransportUnitType,
        active: Boolean(formValue.active)
      }

      this.save.emit({
        transport: transportData,
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
   * Utilidades para template
   */
  getIdentifierLabel(): string {
    if (this.selectedUnitType === 'vehicle') return 'Placa del Vehículo'
    if (this.selectedUnitType === 'fleet') return 'Número de Flota'
    return 'Identificador'
  }

  getIdentifierPlaceholder(): string {
    if (this.selectedUnitType === 'vehicle') return 'ABC123'
    if (this.selectedUnitType === 'fleet') return 'ABC1234Z'
    return 'Selecciona el tipo primero...'
  }

  getFormatHelp(): string {
    if (this.selectedUnitType === 'vehicle') return TRANSPORT_FORMAT_HELP.vehicle
    if (this.selectedUnitType === 'fleet') return TRANSPORT_FORMAT_HELP.fleet
    return ''
  }

  isIdentifierValid(): boolean {
    const identifierControl = this.transportForm.get('identifier')
    return !!(identifierControl?.valid && identifierControl?.value && this.selectedUnitType !== null)
  }

  /**
   * Obtener error de campo
   */
  getFieldError(fieldName: string): string {
    const field = this.transportForm.get(fieldName)

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido'
      if (field.errors['invalidType']) return 'Selecciona un tipo válido'
      if (field.errors['invalidVehicleFormat']) return 'Formato de placa inválido (ej: ABC123)'
      if (field.errors['invalidFleetFormat']) return 'Formato de flota inválido (ej: ABC1234Z)'
    }

    return ''
  }
}
