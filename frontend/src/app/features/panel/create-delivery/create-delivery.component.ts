import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { DeliveryService } from './services/create-delivery.service'
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
} from '@/core/models/delivery.model'

@Component({
  selector: 'app-create-delivery',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-delivery.component.html',
  styleUrl: './create-delivery.component.scss'
})
export class CreateDeliveryComponent implements OnInit {
  private fb = inject(FormBuilder)
  private deliveryService = inject(DeliveryService)
  private router = inject(Router)

  deliveryForm!: FormGroup
  isLoading = false
  isSubmitting = false
  error: string | null = null

  // Datos para los selects
  products: ProductSelect[] = []
  transportUnits: TransportUnitSelect[] = []
  destinations: DestinationSelect[] = []

  // Datos filtrados según la lógica de negocio
  filteredTransportUnits: TransportUnitSelect[] = []
  filteredDestinations: DestinationSelect[] = []

  // Opciones para product_type
  productTypes = Object.values(PRODUCT_TYPES)
  productTypeLabels = PRODUCT_TYPE_LABELS

  // Producto seleccionado para determinar delivery_type
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
      guide: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{10}$/)]],
      transport_unit_id: [null, [Validators.required]],
      destination_id: [null, [Validators.required]]
    })
  }

  public loadSelectData(): void {
    this.isLoading = true
    this.error = null

    this.deliveryService.getSelectData().subscribe({
      next: (data) => {
        this.products = data.products
        this.transportUnits = data.transportUnits
        this.destinations = data.destinations
        this.isLoading = false
      },
      error: (error) => {
        this.error = error.message
        this.isLoading = false
      }
    })
  }

  private setupFormSubscriptions(): void {
    // Suscripción para cambios en product_id
    this.deliveryForm.get('product_id')?.valueChanges.subscribe(productId => {
      this.onProductChange(productId)
    })

    // Validación de fecha de entrega mayor a fecha de registro
    this.deliveryForm.get('delivery_date')?.valueChanges.subscribe(deliveryDate => {
      this.validateDeliveryDate(deliveryDate)
    })
  }

  private onProductChange(productId: number): void {
    this.selectedProduct = this.products.find(p => p.id === productId) || null

    if (this.selectedProduct) {
      // Establecer delivery_type basado en el tipo de producto
      this.currentDeliveryType = this.selectedProduct.type

      // Filtrar transport units y destinations basado en el tipo de producto
      this.filterTransportUnitsAndDestinations(this.selectedProduct.type)

      // Resetear selecciones de transport_unit y destination
      this.deliveryForm.patchValue({
        transport_unit_id: null,
        destination_id: null
      })
    } else {
      this.currentDeliveryType = null
      this.filteredTransportUnits = []
      this.filteredDestinations = []
    }
  }

  private filterTransportUnitsAndDestinations(productType: DeliveryType): void {
    if (productType === 'maritime') {
      // Para productos marítimos: solo fleet y seaport
      this.filteredTransportUnits = this.transportUnits.filter(tu => tu.unit_type === 'fleet')
      this.filteredDestinations = this.destinations.filter(d => d.destination_type === 'seaport')
    } else if (productType === 'terrestrial') {
      // Para productos terrestres: solo vehicle y warehouse_land
      this.filteredTransportUnits = this.transportUnits.filter(tu => tu.unit_type === 'vehicle')
      this.filteredDestinations = this.destinations.filter(d => d.destination_type === 'warehouse_land')
    }
  }

  private validateDeliveryDate(deliveryDate: string): void {
    const logDate = this.deliveryForm.get('log_date')?.value
    if (logDate && deliveryDate && new Date(deliveryDate) <= new Date(logDate)) {
      this.deliveryForm.get('delivery_date')?.setErrors({ invalidDate: true })
    }
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0]
  }

  private getUserIdFromToken(): number {
    // Implementar lógica para obtener user_id del token
    // Por ahora retorno un valor por defecto
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.user_id || payload.id || 6
      } catch {
        return 6 // Valor por defecto
      }
    }
    return 6 // Valor por defecto
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid || !this.currentDeliveryType) {
      this.markFormGroupTouched()
      return
    }

    this.isSubmitting = true
    this.error = null

    const formData: DeliveryFormData = this.deliveryForm.value

    const deliveryRequest: DeliveryCreateRequest = {
      user_id: this.getUserIdFromToken(),
      product_id: formData.product_id,
      product_type: formData.product_type,
      quantity: formData.quantity,
      log_date: formData.log_date,
      delivery_date: formData.delivery_date,
      shipping_price: formData.shipping_price,
      guide: formData.guide.toUpperCase(),
      delivery_type: this.currentDeliveryType,
      transport_unit_id: formData.transport_unit_id,
      destination_id: formData.destination_id
    }

    this.deliveryService.createDelivery(deliveryRequest).subscribe({
      next: () => {
        this.isSubmitting = false
        // Redirigir o mostrar mensaje de éxito
        this.router.navigate(['/deliveries'])
      },
      error: (error) => {
        this.error = error.message
        this.isSubmitting = false
      }
    })
  }

  private markFormGroupTouched(): void {
    Object.keys(this.deliveryForm.controls).forEach(key => {
      this.deliveryForm.get(key)?.markAsTouched()
    })
  }

  // Getters para facilitar el acceso en el template
  get f() { return this.deliveryForm.controls }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.deliveryForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string): string {
    const field = this.deliveryForm.get(fieldName)
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`
      if (field.errors['min']) return `Valor mínimo no válido`
      if (field.errors['pattern']) return 'Formato inválido (10 caracteres alfanuméricos)'
      if (field.errors['invalidDate']) return 'La fecha de entrega debe ser posterior a la fecha de registro'
    }
    return ''
  }

  onCancel(): void {
    this.router.navigate(['/deliveries'])
  }
}

