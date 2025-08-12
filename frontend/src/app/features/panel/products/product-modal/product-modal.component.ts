import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import type { Product, ProductFormData, ProductType } from '@/core/models/product.model'
import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS } from '@/core/models/product.model'

export interface ProductSaveEvent {
  product: ProductFormData
  isEdit: boolean
}

@Component({
  selector: 'app-product-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() product: Product | null = null
  @Input() isLoading = false
  @Input() errorMessage = ''

  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<ProductSaveEvent>()

  productForm!: FormGroup
  isEditMode = false

  // Expose constants to template
  readonly PRODUCT_TYPES = PRODUCT_TYPES
  readonly PRODUCT_TYPE_LABELS = PRODUCT_TYPE_LABELS

  constructor(private fb: FormBuilder) {
    this.initForm()
  }

  ngOnInit(): void {
    this.initForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.isEditMode = true
      this.loadProductData()
    } else if (changes['isOpen'] && this.isOpen && !this.product) {
      this.isEditMode = false
      this.resetForm()
    }
  }

  /**
   * Inicializar formulario (Single Responsibility Principle)
   */
  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      type: ['', [Validators.required, this.validateProductType]],
      date_creation: ['', [Validators.required]]
    })
  }

  /**
   * Validador personalizado para tipo de producto
   */
  private validateProductType(control: any) {
    const validTypes = [PRODUCT_TYPES.MARITIME, PRODUCT_TYPES.TERRESTRIAL]
    return validTypes.includes(control.value) ? null : { invalidType: true }
  }

  /**
   * Cargar datos del producto en el formulario
   */
  private loadProductData(): void {
    if (this.product) {
      // Convertir fecha para el input date
      const dateValue = this.product.date_creation.split('T')[0]

      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        type: this.product.type,
        date_creation: dateValue
      })
    }
  }

  /**
   * Resetear formulario
   */
  private resetForm(): void {
    this.productForm.reset()
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    this.productForm.patchValue({ date_creation: today })
  }

  /**
   * Manejar envío del formulario
   */
  onSubmit(): void {
    if (this.productForm.valid && !this.isLoading) {
      const formValue = this.productForm.value

      const productData: ProductFormData = {
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        type: formValue.type as ProductType,
        date_creation: formValue.date_creation
      }

      this.save.emit({
        product: productData,
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
    const field = this.productForm.get(fieldName)

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido'
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`
      if (field.errors['invalidType']) return 'Selecciona un tipo válido'
    }

    return ''
  }
}
