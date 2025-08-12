import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BehaviorSubject } from 'rxjs'
import { DeliveryService } from './services/delivery.service'
import type { Delivery } from '@/core/models/delivery.model'
import {
  DELIVERY_TYPE_LABELS,
  PRODUCT_TYPE_LABELS
} from '@/core/models/delivery.model'

// Interface para el estado del componente
interface DeliveryListState {
  deliveries: Delivery[]
  filteredDeliveries: Delivery[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  deliveryTypeFilter: string
  productTypeFilter: string
  sortColumn: keyof Delivery | null
  sortDirection: 'asc' | 'desc'
}

@Component({
  selector: 'app-deliveries',
  imports: [CommonModule],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.scss'
})
export class DeliveriesComponent implements OnInit {
  private deliveryService = inject(DeliveryService)

  // State management
  private stateSubject = new BehaviorSubject<DeliveryListState>({
    deliveries: [],
    filteredDeliveries: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    deliveryTypeFilter: '',
    productTypeFilter: '',
    sortColumn: null,
    sortDirection: 'asc'
  })

  // Public observable
  state$ = this.stateSubject.asObservable()

  // Current state getter
  get currentState() { return this.stateSubject.value }

  // Expose to template
  get deliveries() { return this.currentState.deliveries }
  get filteredDeliveries() { return this.currentState.filteredDeliveries }
  get isLoading() { return this.currentState.isLoading }
  get error() { return this.currentState.error }
  get searchTerm() { return this.currentState.searchTerm }
  get deliveryTypeFilter() { return this.currentState.deliveryTypeFilter }
  get productTypeFilter() { return this.currentState.productTypeFilter }
  get sortColumn() { return this.currentState.sortColumn }
  get sortDirection() { return this.currentState.sortDirection }

  readonly DELIVERY_TYPE_LABELS = DELIVERY_TYPE_LABELS
  readonly PRODUCT_TYPE_LABELS = PRODUCT_TYPE_LABELS

  ngOnInit(): void {
    this.loadDeliveries()
  }

  /**
   * Cargar entregas desde el API
   */
  loadDeliveries(): void {
    this.updateState({ isLoading: true, error: null })

    this.deliveryService.getDeliveries().subscribe({
      next: (deliveries) => {
        this.updateState({
          deliveries,
          filteredDeliveries: deliveries,
          isLoading: false
        })
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al cargar entregas'
        })
      }
    })
  }

  /**
   * Buscar entregas
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement
    const searchTerm = target.value.toLowerCase()

    this.updateState({ searchTerm })
    this.applyFilters()
  }

  /**
   * Filtrar por tipo de entrega
   */
  onDeliveryTypeFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    this.updateState({ deliveryTypeFilter: target.value })
    this.applyFilters()
  }

  /**
   * Filtrar por tipo de producto
   */
  onProductTypeFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    this.updateState({ productTypeFilter: target.value })
    this.applyFilters()
  }

  /**
   * Aplicar todos los filtros
   */
  private applyFilters(): void {
    let filtered = [...this.currentState.deliveries]

    // Filtro de búsqueda
    if (this.currentState.searchTerm) {
      const searchTerm = this.currentState.searchTerm.toLowerCase()
      filtered = filtered.filter(delivery =>
        delivery.guide.toLowerCase().includes(searchTerm) ||
        delivery.user.name.toLowerCase().includes(searchTerm) ||
        delivery.user.email.toLowerCase().includes(searchTerm) ||
        delivery.destination.name.toLowerCase().includes(searchTerm) ||
        delivery.destination.location.toLowerCase().includes(searchTerm) ||
        delivery.transport_unit.identifier.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por tipo de entrega
    if (this.currentState.deliveryTypeFilter) {
      filtered = filtered.filter(delivery =>
        delivery.delivery_type === this.currentState.deliveryTypeFilter
      )
    }

    // Filtro por tipo de producto
    if (this.currentState.productTypeFilter) {
      filtered = filtered.filter(delivery =>
        delivery.product_type === this.currentState.productTypeFilter
      )
    }

    this.updateState({
      filteredDeliveries: this.applySorting(filtered)
    })
  }

  /**
   * Ordenar por columna
   */
  sortBy(column: keyof Delivery): void {
    const currentSort = this.currentState.sortColumn
    const currentDirection = this.currentState.sortDirection

    const newDirection = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc'

    this.updateState({
      sortColumn: column,
      sortDirection: newDirection,
      filteredDeliveries: this.applySorting(this.currentState.filteredDeliveries, column, newDirection)
    })
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    deliveries: Delivery[],
    column?: keyof Delivery,
    direction?: 'asc' | 'desc'
  ): Delivery[] {
    const sortColumn = column || this.currentState.sortColumn
    const sortDirection = direction || this.currentState.sortDirection

    if (!sortColumn) return deliveries

    return [...deliveries].sort((a, b) => {
      let aValue: any = a[sortColumn]
      let bValue: any = b[sortColumn]

      // Manejar casos especiales de ordenamiento
      if (sortColumn === 'delivery_date' || sortColumn === 'log_date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  /**
   * Utilidades para template
   */
  trackByDelivery(index: number, delivery: Delivery): number {
    return delivery.id
  }

  getDeliveryTypeLabel(type: string): string {
    return DELIVERY_TYPE_LABELS[type as keyof typeof DELIVERY_TYPE_LABELS] || type
  }


  getDeliveryTypeStyle(type: string): string {
    switch (type) {
      case 'terrestrial':
        return 'bg-green-100 text-green-800'
      case 'maritime':
        return 'bg-blue-100 text-blue-800'
      case 'aerial':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  getProductTypeLabel(type: string): string {
    return PRODUCT_TYPE_LABELS[type as keyof typeof PRODUCT_TYPE_LABELS] || type
  }

  getProductTypeStyle(type: string): string {
    switch (type) {
      case 'electronics':
        return 'bg-blue-100 text-blue-800'
      case 'clothing':
        return 'bg-pink-100 text-pink-800'
      case 'food':
        return 'bg-orange-100 text-orange-800'
      case 'furniture':
        return 'bg-yellow-100 text-yellow-800'
      case 'books':
        return 'bg-indigo-100 text-indigo-800'
      case 'toys':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Formatear fecha para mostrar en el template
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  /**
   * Calcular el total de precios finales
   */
  getTotalFinalPrice(): string {
    const total = this.filteredDeliveries.reduce((sum, delivery) => {
      return sum + parseFloat(delivery.final_price)
    }, 0)
    return total.toFixed(2)
  }

  /**
   * Calcular el total de precios de envío
   */
  getTotalShippingPrice(): string {
    const total = this.filteredDeliveries.reduce((sum, delivery) => {
      return sum + parseFloat(delivery.shipping_price)
    }, 0)
    return total.toFixed(2)
  }

  /**
   * Calcular el ahorro total (diferencia entre precio de envío y precio final)
   */
  getTotalSavings(): string {
    const savings = this.filteredDeliveries.reduce((sum, delivery) => {
      const shipping = parseFloat(delivery.shipping_price)
      const final = parseFloat(delivery.final_price)
      return sum + (shipping - final)
    }, 0)
    return savings.toFixed(2)
  }

  /**
   * Obtener el conteo de entregas por tipo
   */
  getDeliveryTypeCount(type: string): number {
    return this.filteredDeliveries.filter(delivery => delivery.delivery_type === type).length
  }

  /**
   * Obtener el conteo de productos por tipo
   */
  getProductTypeCount(type: string): number {
    return this.filteredDeliveries.filter(delivery => delivery.product_type === type).length
  }

  /**
   * Verificar si hay entregas pendientes (fecha de entrega futura)
   */
  getPendingDeliveriesCount(): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return this.filteredDeliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.delivery_date)
      deliveryDate.setHours(0, 0, 0, 0)
      return deliveryDate > today
    }).length
  }

  /**
   * Verificar si hay entregas completadas (fecha de entrega pasada)
   */
  getCompletedDeliveriesCount(): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return this.filteredDeliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.delivery_date)
      deliveryDate.setHours(0, 0, 0, 0)
      return deliveryDate <= today
    }).length
  }

  /**
   * Obtener estado de entrega basado en la fecha
   */
  getDeliveryStatus(delivery: Delivery): 'pending' | 'completed' | 'today' {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deliveryDate = new Date(delivery.delivery_date)
    deliveryDate.setHours(0, 0, 0, 0)

    if (deliveryDate.getTime() === today.getTime()) {
      return 'today'
    } else if (deliveryDate > today) {
      return 'pending'
    } else {
      return 'completed'
    }
  }

  /**
   * Obtener estilo para el estado de entrega
   */
  getDeliveryStatusStyle(delivery: Delivery): string {
    const status = this.getDeliveryStatus(delivery)

    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'today':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Obtener label para el estado de entrega
   */
  getDeliveryStatusLabel(delivery: Delivery): string {
    const status = this.getDeliveryStatus(delivery)

    switch (status) {
      case 'completed':
        return 'Entregado'
      case 'pending':
        return 'Pendiente'
      case 'today':
        return 'Hoy'
      default:
        return 'Desconocido'
    }
  }

  /**
   * Helper method for state management (Single Responsibility Principle)
   */
  private updateState(partialState: Partial<DeliveryListState>): void {
    this.stateSubject.next({ ...this.currentState, ...partialState })
  }
}
