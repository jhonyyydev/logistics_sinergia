import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ProductService } from "../../services/product.service"
import { NotificationService } from "../../../../core/services/notification.service"
import { LoadingComponent } from "../../../../shared/components/loading/loading.component"
import { ConfirmDialogComponent } from "../../../../shared/components/confirm-dialog/confirm-dialog.component"
import type { Product } from "../../../../core/models/product.model"

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent, ConfirmDialogComponent],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService)
  private notificationService = inject(NotificationService)

  products: Product[] = []
  filteredProducts: Product[] = []
  isLoading = false
  searchTerm = ""
  sortField = "name"
  sortDirection: "asc" | "desc" = "asc"

  // Pagination
  currentPage = 1
  itemsPerPage = 10
  totalItems = 0
  itemsPerPageOptions = [5, 10, 20]

  // Confirm dialog
  showConfirmDialog = false
  productToDelete: Product | null = null

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.isLoading = true
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data || []
        this.applyFilters()
        this.isLoading = false
      },
      error: (error) => {
        this.notificationService.showError("Error al cargar productos")
        this.isLoading = false
      },
    })
  }

  applyFilters(): void {
    let filtered = [...this.products]

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.type.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[this.sortField as keyof Product] as string
      const bValue = b[this.sortField as keyof Product] as string

      if (this.sortDirection === "asc") {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    this.totalItems = filtered.length
    this.filteredProducts = filtered
  }

  onSearch(): void {
    this.currentPage = 1
    this.applyFilters()
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    } else {
      this.sortField = field
      this.sortDirection = "asc"
    }
    this.applyFilters()
  }

  onPageSizeChange(): void {
    this.currentPage = 1
  }

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredProducts.slice(startIndex, endIndex)
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage)
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page
    }
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product
    this.showConfirmDialog = true
  }

  onDeleteConfirmed(): void {
    if (this.productToDelete?.id) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Producto eliminado exitosamente")
          this.loadProducts()
          this.showConfirmDialog = false
          this.productToDelete = null
        },
        error: (error) => {
          this.notificationService.showError("Error al eliminar producto")
          this.showConfirmDialog = false
          this.productToDelete = null
        },
      })
    }
  }

  onDeleteCancelled(): void {
    this.showConfirmDialog = false
    this.productToDelete = null
  }

  getTypeLabel(type: string): string {
    return type === "maritime" ? "Marítimo" : "Terrestre"
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-ES")
  }
}
