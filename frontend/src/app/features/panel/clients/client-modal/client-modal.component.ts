import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms'
import type { Client, ClientFormData, ClientType } from '@/core/models/client.model'
import {
  CLIENT_TYPES,
  CLIENT_TYPE_LABELS,
  CLIENT_VALIDATIONS,
  CLIENT_MAX_LENGTHS
} from '@/core/models/client.model'

// Interface para el evento de guardar
export interface ClientSaveEvent {
  client: ClientFormData
  isEdit: boolean
}

@Component({
  selector: 'app-client-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-modal.component.html',
  styleUrl: './client-modal.component.scss'
})
export class ClientModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() client: Client | null = null
  @Input() isLoading = false
  @Input() errorMessage = ''

  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<ClientSaveEvent>()

  clientForm!: FormGroup
  isEditMode = false

  // Expose constants to template
  readonly CLIENT_TYPES = CLIENT_TYPES
  readonly CLIENT_TYPE_LABELS = CLIENT_TYPE_LABELS

  constructor(private fb: FormBuilder) {
    this.initForm()
  }

  ngOnInit(): void {
    this.initForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client) {
      this.isEditMode = true
      this.loadClientData()
    } else if (changes['isOpen'] && this.isOpen && !this.client) {
      this.isEditMode = false
      this.resetForm()
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, this.validateName]],
      email: ['', [Validators.required, this.validateEmail]],
      phone: ['', [Validators.required, this.validatePhone]],
      address: ['', [Validators.required]],
      type: ['', [Validators.required, this.validateClientType]],
      active: [true]
    })
  }

  /**
   * Validador para nombre
   */
  private validateName(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null

    const value = control.value.trim()
    if (!CLIENT_VALIDATIONS.FULL_NAME.test(value)) {
      return { invalidName: true }
    }

    return null
  }

  /**
   * Validador para email - CRÍTICO
   */
  private validateEmail(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null

    const email = control.value.trim().toLowerCase()

    if (!CLIENT_VALIDATIONS.EMAIL.test(email)) {
      return { invalidEmail: true }
    }

    // Validaciones adicionales
    if (email.includes('..')) {
      return { invalidEmail: true }
    }

    if (email.startsWith('.') || email.startsWith('@')) {
      return { invalidEmail: true }
    }

    return null
  }

  /**
   * Validador para teléfono
   */
  private validatePhone(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null

    const phone = control.value.trim()

    if (!CLIENT_VALIDATIONS.PHONE.test(phone)) {
      return { invalidPhone: true }
    }

    const digitsOnly = phone.replace(/\D/g, '')

    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return { invalidPhone: true }
    }

    return null
  }

  /**
   * Validador para tipo de cliente
   */
  private validateClientType(control: AbstractControl): ValidationErrors | null {
    const validTypes = [CLIENT_TYPES.NATIONAL, CLIENT_TYPES.INTERNATIONAL]
    return validTypes.includes(control.value) ? null : { invalidType: true }
  }

  /**
   * Cargar datos del cliente
   */
  private loadClientData(): void {
    if (this.client) {
      this.clientForm.patchValue({
        name: this.client.full_name,
        email: this.client.email,
        phone: this.client.phone,
        address: this.client.address,
        type: this.client.type,
        active: this.client.active
      })
    }
  }

  /**
   * Resetear formulario
   */
  private resetForm(): void {
    this.clientForm.reset({ active: true })
  }

  /**
   * Manejar envío del formulario
   */
  onSubmit(): void {
    if (this.clientForm.valid && !this.isLoading) {
      const formValue = this.clientForm.value

      const clientData: ClientFormData = {
        full_name: formValue.name.trim(),
        email: formValue.email.trim().toLowerCase(),
        phone: formValue.phone.trim(),
        address: formValue.address.trim(),
        type: formValue.type as ClientType,
        active: Boolean(formValue.active)
      }

      this.save.emit({
        client: clientData,
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
   * Verificar si campo es válido
   */
  isFieldValid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName)
    return !!(field?.valid && field?.touched && field?.value)
  }

  /**
   * Obtener error de campo
   */
  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName)

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido'
      if (field.errors['invalidName']) return 'El nombre solo debe contener letras y espacios'
      if (field.errors['invalidEmail']) return 'Formato de email inválido (ej: usuario@ejemplo.com)'
      if (field.errors['invalidPhone']) return 'Formato de teléfono inválido'
      if (field.errors['invalidType']) return 'Selecciona un tipo válido'
    }

    return ''
  }
}
