import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { CreateDeliveryService } from './services/create-delivery.service'
import type {
  DeliveryCreateRequest,
  DeliveryFormData,
  ProductSelect,
  TransportUnitSelect,
  DestinationSelect,
  ProductType,
  DeliveryType
} from '@/core/models/delivery-form.model'
import {
  PRODUCT_TYPES,
  PRODUCT_TYPE_LABELS,
  DELIVERY_TYPE_LABELS
} from '@/core/models/delivery-form.model'

@Component({
  selector: 'app-create-delivery',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-delivery.component.html',
  styleUrl: './create-delivery.component.scss'
})
export class CreateDeliveryComponent implements OnInit {
  private fb = inject(FormBuilder)
  private deliveryService = inject(CreateDeliveryService)
  private router = inject(Router)

  deliveryForm!: FormGroup
  isLoading = false
  isSubmitting = false
  error: string | null = null

  // Datos para los selects - sin filtros
  products: ProductSelect[] = []
  transportUnits: TransportUnitSelect[] = []
  destinations: DestinationSelect[] = []

  // Opciones para product_type
  productTypes = Object.values(PRODUCT_TYPES)
  productTypeLabels = PRODUCT_TYPE_LABELS

  // Producto seleccionado
  selectedProduct: ProductSelect | null = null
  currentDeliveryType: DeliveryType | null = null

  ngOnInit(): void {
    this.initializeForm()
    this.loadSelectData()
    this.setupFormSubscriptions()
  }

  private initializeForm(): void {
    this.deliveryForm = this.fb.group({
      product_id: [null, [Validators.required]],
      product_type: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      log_date: [this.getCurrentDate(), [Validators.required]],
      delivery_date: ['', [Validators.required]],
      shipping_price: [0, [Validators.required, Validators.min(0)]],
      guide: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Za-z0-9]{10}$/) // Acepta alfanuméricos
      ]],
      transport_unit_id: [null, [Validators.required]],
      destination_id: [null, [Validators.required]]
    })
  }

  loadSelectData(): void {
    this.isLoading = true
    this.error = null

    this.deliveryService.getSelectData().subscribe({
      next: (data) => {
        this.products = data.products
        this.transportUnits = data.transportUnits
        this.destinations = data.destinations
        this.isLoading = false
      },
      error: (err) => {
        console.error('Error cargando datos:', err)
        this.error = 'Error al cargar los datos. Por favor, intente nuevamente.'
        this.isLoading = false
      }
    })
  }

  private setupFormSubscriptions(): void {
    // Suscripción simplificada para cambios en product_id
    this.deliveryForm.get('product_id')?.valueChanges.subscribe(productId => {
      if (productId) {
        // Asegurar que el ID sea numérico para la comparación
        const numericId = Number(productId)
        this.selectedProduct = this.products.find(p => p.id === numericId) || null

        if (this.selectedProduct) {
          // Actualizar product_type automáticamente
          this.deliveryForm.patchValue({
            product_type: this.selectedProduct.type
          }, { emitEvent: false })

          // Establecer delivery_type basado en el tipo del producto
          // maritime o terrestrial
          this.currentDeliveryType = this.selectedProduct.type === 'maritime' ? 'maritime' : 'terrestrial'

          console.log('Producto seleccionado:', this.selectedProduct)
          console.log('Tipo de entrega establecido:', this.currentDeliveryType)
        }
      } else {
        this.selectedProduct = null
        this.currentDeliveryType = null
      }
    })

    // Validación de fecha de entrega
    this.deliveryForm.get('delivery_date')?.valueChanges.subscribe(() => {
      this.validateDates()
    })

    this.deliveryForm.get('log_date')?.valueChanges.subscribe(() => {
      this.validateDates()
    })
  }

  private validateDates(): void {
    const logDate = this.deliveryForm.get('log_date')?.value
    const deliveryDate = this.deliveryForm.get('delivery_date')?.value

    if (logDate && deliveryDate) {
      const log = new Date(logDate)
      const delivery = new Date(deliveryDate)

      if (delivery <= log) {
        this.deliveryForm.get('delivery_date')?.setErrors({ invalidDate: true })
      } else {
        // Limpiar error si la fecha es válida
        const errors = this.deliveryForm.get('delivery_date')?.errors
        if (errors?.['invalidDate']) {
          delete errors['invalidDate']
          const hasErrors = Object.keys(errors).length > 0
          this.deliveryForm.get('delivery_date')?.setErrors(hasErrors ? errors : null)
        }
      }
    }
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0]
  }

  private getUserIdFromToken(): number {
    // Por defecto retorna 6 si no hay token
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.user_id || payload.id || 6
      } catch (e) {
        console.error('Error decodificando token:', e)
        return 6
      }
    }
    return 6
  }

  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched()

    if (this.deliveryForm.invalid) {
      this.error = 'Por favor, complete todos los campos requeridos correctamente.'
      console.error('Formulario inválido:', this.deliveryForm.errors)
      console.error('Campos con errores:', this.getFormValidationErrors())
      return
    }

    if (!this.selectedProduct) {
      this.error = 'Por favor, seleccione un producto válido.'
      return
    }

    this.isSubmitting = true
    this.error = null

    const formData: DeliveryFormData = this.deliveryForm.value

    // Determinar el delivery_type basado en el producto
    const deliveryType = this.selectedProduct.type === 'maritime' ? 'maritime' : 'terrestrial'

    const deliveryRequest: DeliveryCreateRequest = {
      user_id: this.getUserIdFromToken(),
      product_id: Number(formData.product_id),
      product_type: formData.product_type as ProductType,
      quantity: Number(formData.quantity),
      log_date: formData.log_date,
      delivery_date: formData.delivery_date,
      shipping_price: Number(formData.shipping_price),
      guide: String(formData.guide).toUpperCase(),
      delivery_type: deliveryType,
      transport_unit_id: Number(formData.transport_unit_id),
      destination_id: Number(formData.destination_id)
    }

    console.log('Enviando solicitud de entrega:', deliveryRequest)

    this.deliveryService.createDelivery(deliveryRequest).subscribe({
      next: (response) => {
        console.log('Entrega creada exitosamente:', response)
        this.isSubmitting = false
        // Redirigir después de crear exitosamente
        this.router.navigate(['/deliveries'])
      },
      error: (error) => {
        console.error('Error creando entrega:', error)
        this.error = error.message || 'Error al crear la entrega. Por favor, intente nuevamente.'
        this.isSubmitting = false
      }
    })
  }

  private getFormValidationErrors(): any {
    const errors: any = {}
    Object.keys(this.deliveryForm.controls).forEach(key => {
      const control = this.deliveryForm.get(key)
      if (control && control.errors) {
        errors[key] = control.errors
      }
    })
    return errors
  }

  private markFormGroupTouched(): void {
    Object.keys(this.deliveryForm.controls).forEach(key => {
      const control = this.deliveryForm.get(key)
      control?.markAsTouched()
      control?.updateValueAndValidity()
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.deliveryForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string): string {
    const field = this.deliveryForm.get(fieldName)
    if (field?.errors) {
      if (field.errors['required']) {
        return `Este campo es requerido`
      }
      if (field.errors['min']) {
        return `El valor mínimo es ${field.errors['min'].min}`
      }
      if (field.errors['minLength']) {
        return `Debe tener exactamente ${field.errors['minLength'].requiredLength} caracteres`
      }
      if (field.errors['maxLength']) {
        return `Máximo ${field.errors['maxLength'].requiredLength} caracteres`
      }
      if (field.errors['pattern']) {
        return 'Solo se permiten letras y números (10 caracteres)'
      }
      if (field.errors['invalidDate']) {
        return 'La fecha de entrega debe ser posterior a la fecha de registro'
      }
    }
    return ''
  }

  onCancel(): void {
    if (this.isSubmitting) {
      return // No permitir cancelar mientras se está enviando
    }
    this.router.navigate(['/deliveries'])
  }

  onGuideInput(event: Event): void {
    const input = event.target as HTMLInputElement
    const value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    this.deliveryForm.patchValue({ guide: value }, { emitEvent: false })
  }
}
