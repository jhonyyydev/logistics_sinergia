import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { ProductService } from "../../services/product.service"
import { NotificationService } from "../../../../core/services/notification.service"
import type { ProductRequest } from "../../../../core/models/product.model"

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private productService = inject(ProductService)
  private notificationService = inject(NotificationService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  productForm: FormGroup
  isLoading = false
  isEditMode = false
  productId: number | null = null

  constructor() {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      type: ["maritime", [Validators.required]],
      date_creation: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.productId = Number.parseInt(id, 10)
      this.loadProduct()
    } else {
      // Set default date to today
      const today = new Date().toISOString().split("T")[0]
      this.productForm.patchValue({ date_creation: today })
    }
  }

  loadProduct(): void {
    if (this.productId) {
      this.isLoading = true
      this.productService.getProduct(this.productId).subscribe({
        next: (response) => {
          const product = response.data
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            type: product.type,
            date_creation: product.date_creation,
          })
          this.isLoading = false
        },
        error: (error) => {
          this.notificationService.showError("Error al cargar producto")
          this.router.navigate(["/dashboard/products"])
          this.isLoading = false
        },
      })
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true
      const productData: ProductRequest = this.productForm.value

      const operation = this.isEditMode
        ? this.productService.updateProduct(this.productId!, productData)
        : this.productService.createProduct(productData)

      operation.subscribe({
        next: (response) => {
          const message = this.isEditMode ? "Producto actualizado exitosamente" : "Producto creado exitosamente"
          this.notificationService.showSuccess(message)
          this.router.navigate(["/dashboard/products"])
          this.isLoading = false
        },
        error: (error) => {
          const message = this.isEditMode ? "Error al actualizar producto" : "Error al crear producto"
          this.notificationService.showError(message)
          this.isLoading = false
        },
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  onCancel(): void {
    this.router.navigate(["/dashboard/products"])
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} es requerido`
      if (field.errors["minlength"])
        return `${fieldName} debe tener al menos ${field.errors["minlength"].requiredLength} caracteres`
    }
    return ""
  }
}
