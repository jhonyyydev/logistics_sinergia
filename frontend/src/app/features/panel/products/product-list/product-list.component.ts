import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable, BehaviorSubject, combineLatest } from 'rxjs'
import { map, startWith, catchError } from 'rxjs/operators'
import { ProductService } from '../services/product.service'
import { ProductModalComponent, type ProductSaveEvent } from '../product-modal/product-modal.component'
import type { Product } from '@/core/models/product.model'
import { PRODUCT_TYPE_LABELS } from '@/core/models/product.model'

interface ProductListState {
  products: Product[]
  filteredProducts: Product[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  sortColumn: keyof Product | null
  sortDirection: 'asc' | 'desc'
}

// Interface para las acciones del modal
interface ModalState {
  isOpen: boolean
  isLoading: boolean
  error: string
  editingProduct: Product | null
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService)

  // State management
  private stateSubject = new BehaviorSubject<ProductListState>({
    products: [],
    filteredProducts: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    sortColumn: null,
    sortDirection: 'asc'
  })

  private modalStateSubject = new BehaviorSubject<ModalState>({
    isOpen: false,
    isLoading: false,
    error: '',
    editingProduct: null
  })

  // Public observables
  state$ = this.stateSubject.asObservable()
  modalState$ = this.modalStateSubject.asObservable()

  // Current state getters
  get currentState() { return this.stateSubject.value }
  get modalState() { return this.modalStateSubject.value }

  // Expose to template
  get products() { return this.currentState.products }
  get filteredProducts() { return this.currentState.filteredProducts }
  get isLoading() { return this.currentState.isLoading }
  get error() { return this.currentState.error }
  get searchTerm() { return this.currentState.searchTerm }
  get sortColumn() { return this.currentState.sortColumn }
  get sortDirection() { return this.currentState.sortDirection }

  readonly PRODUCT_TYPE_LABELS = PRODUCT_TYPE_LABELS

  ngOnInit(): void {
    this.loadProducts()
  }

  /**
   * Cargar productos desde el API
   */
  loadProducts(): void {
    this.updateState({ isLoading: true, error: null })

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.updateState({
          products,
          filteredProducts: products,
          isLoading: false
        })
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al cargar productos'
        })
      }
    })
  }

  /**
   * Buscar productos
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement
    const searchTerm = target.value.toLowerCase()

    const filtered = this.currentState.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      this.getTypeLabel(product.type).toLowerCase().includes(searchTerm)
    )

    this.updateState({
      searchTerm,
      filteredProducts: this.applySorting(filtered)
    })
  }

  /**
   * Ordenar por columna
   */
  sortBy(column: keyof Product): void {
    const currentSort = this.currentState.sortColumn
    const currentDirection = this.currentState.sortDirection

    const newDirection = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc'

    this.updateState({
      sortColumn: column,
      sortDirection: newDirection,
      filteredProducts: this.applySorting(this.currentState.filteredProducts, column, newDirection)
    })
  }

  /**
   * Toggle sort (for sort button)
   */
  toggleSort(): void {
    if (this.currentState.sortColumn) {
      const newDirection = this.currentState.sortDirection === 'asc' ? 'desc' : 'asc'
      this.sortBy(this.currentState.sortColumn)
    } else {
      this.sortBy('name')
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    products: Product[],
    column?: keyof Product,
    direction?: 'asc' | 'desc'
  ): Product[] {
    const sortColumn = column || this.currentState.sortColumn
    const sortDirection = direction || this.currentState.sortDirection

    if (!sortColumn) return products

    return [...products].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  /**
   * Abrir modal para crear producto
   */
  openCreateModal(): void {
    this.updateModalState({
      isOpen: true,
      editingProduct: null,
      error: ''
    })
  }

  /**
   * Abrir modal para editar producto
   */
  openEditModal(product: Product): void {
    this.updateModalState({
      isOpen: true,
      editingProduct: product,
      error: ''
    })
  }

  /**
   * Cerrar modal
   */
  closeModal(): void {
    this.updateModalState({
      isOpen: false,
      editingProduct: null,
      error: '',
      isLoading: false
    })
  }

  /**
   * Guardar producto (crear o editar)
   */
  onSaveProduct(event: ProductSaveEvent): void {
    this.updateModalState({ isLoading: true, error: '' })

    const operation = event.isEdit && this.modalState.editingProduct
      ? this.productService.updateProduct(this.modalState.editingProduct.id, event.product)
      : this.productService.createProduct(event.product)

    operation.subscribe({
      next: () => {
        this.updateModalState({ isLoading: false })
        this.closeModal()
        this.loadProducts() // Reload products
      },
      error: (error) => {
        this.updateModalState({
          isLoading: false,
          error: error.message || 'Error al guardar producto'
        })
      }
    })
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(product: Product): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      this.deleteProduct(product.id)
    }
  }

  /**
   * Eliminar producto
   */
  private deleteProduct(id: number): void {
    this.updateState({ isLoading: true })

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts() // Reload products
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al eliminar producto'
        })
      }
    })
  }

  /**
   * Utilidades para template
   */
  trackByProduct(index: number, product: Product): number {
    return product.id
  }

  getTypeLabel(type: string): string {
    return PRODUCT_TYPE_LABELS[type as keyof typeof PRODUCT_TYPE_LABELS] || type
  }

  getTypeStyle(type: string): string {
    switch (type) {
      case 'maritime':
        return 'bg-blue-100 text-blue-800'
      case 'terrestrial':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  /**
   * Helper methods for state management (Single Responsibility Principle)
   */
  private updateState(partialState: Partial<ProductListState>): void {
    this.stateSubject.next({ ...this.currentState, ...partialState })
  }

  private updateModalState(partialState: Partial<ModalState>): void {
    this.modalStateSubject.next({ ...this.modalState, ...partialState })
  }
}
