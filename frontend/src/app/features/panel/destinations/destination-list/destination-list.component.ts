import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BehaviorSubject } from 'rxjs'
import { DestinationService } from '../services/destination.service'
import { DestinationModalComponent, type DestinationSaveEvent } from '../destination-modal/destination-modal.component'
import type { Destination } from '@/core/models/destination.model'
import { DESTINATION_TYPE_LABELS } from '@/core/models/destination.model'

interface DestinationListState {
  destinations: Destination[]
  filteredDestinations: Destination[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  sortColumn: keyof Destination | null
  sortDirection: 'asc' | 'desc'
}

interface ModalState {
  isOpen: boolean
  isLoading: boolean
  error: string
  editingDestination: Destination | null
}

@Component({
  selector: 'app-destination-list',
  imports: [CommonModule, DestinationModalComponent],
  templateUrl: './destination-list.component.html',
  styleUrl: './destination-list.component.scss'
})
export class DestinationListComponent implements OnInit {
  private destinationService = inject(DestinationService)

  // State management
  private stateSubject = new BehaviorSubject<DestinationListState>({
    destinations: [],
    filteredDestinations: [],
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
    editingDestination: null
  })

  // Public observables
  state$ = this.stateSubject.asObservable()
  modalState$ = this.modalStateSubject.asObservable()

  get currentState() { return this.stateSubject.value }
  get modalState() { return this.modalStateSubject.value }

  get destinations() { return this.currentState.destinations }
  get filteredDestinations() { return this.currentState.filteredDestinations }
  get isLoading() { return this.currentState.isLoading }
  get error() { return this.currentState.error }
  get searchTerm() { return this.currentState.searchTerm }
  get sortColumn() { return this.currentState.sortColumn }
  get sortDirection() { return this.currentState.sortDirection }

  readonly DESTINATION_TYPE_LABELS = DESTINATION_TYPE_LABELS

  ngOnInit(): void {
    this.loadDestinations()
  }

  /**
   * Cargar destinos desde el API
   */
  loadDestinations(): void {
    this.updateState({ isLoading: true, error: null })

    this.destinationService.getDestinations().subscribe({
      next: (destinations) => {
        this.updateState({
          destinations,
          filteredDestinations: destinations,
          isLoading: false
        })
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al cargar destinos'
        })
      }
    })
  }

  /**
   * Buscar destinos
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement
    const searchTerm = target.value.toLowerCase()

    const filtered = this.currentState.destinations.filter(destination =>
      destination.name.toLowerCase().includes(searchTerm) ||
      destination.location.toLowerCase().includes(searchTerm) ||
      this.getTypeLabel(destination.type).toLowerCase().includes(searchTerm)
    )

    this.updateState({
      searchTerm,
      filteredDestinations: this.applySorting(filtered)
    })
  }

  /**
   * Ordenar por columna
   */
  sortBy(column: keyof Destination): void {
    const currentSort = this.currentState.sortColumn
    const currentDirection = this.currentState.sortDirection

    const newDirection = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc'

    this.updateState({
      sortColumn: column,
      sortDirection: newDirection,
      filteredDestinations: this.applySorting(this.currentState.filteredDestinations, column, newDirection)
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
    destinations: Destination[],
    column?: keyof Destination,
    direction?: 'asc' | 'desc'
  ): Destination[] {
    const sortColumn = column || this.currentState.sortColumn
    const sortDirection = direction || this.currentState.sortDirection

    if (!sortColumn) return destinations

    return [...destinations].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  /**
   * Abrir modal para crear destino
   */
  openCreateModal(): void {
    this.updateModalState({
      isOpen: true,
      editingDestination: null,
      error: ''
    })
  }

  /**
   * Abrir modal para editar destino
   */
  openEditModal(destination: Destination): void {
    this.updateModalState({
      isOpen: true,
      editingDestination: destination,
      error: ''
    })
  }

  /**
   * Cerrar modal
   */
  closeModal(): void {
    this.updateModalState({
      isOpen: false,
      editingDestination: null,
      error: '',
      isLoading: false
    })
  }

  /**
   * Guardar destino (crear o editar)
   */
  onSaveDestination(event: DestinationSaveEvent): void {
    this.updateModalState({ isLoading: true, error: '' })

    const operation = event.isEdit && this.modalState.editingDestination
      ? this.destinationService.updateDestination(this.modalState.editingDestination.id, event.destination)
      : this.destinationService.createDestination(event.destination)

    operation.subscribe({
      next: () => {
        this.updateModalState({ isLoading: false })
        this.closeModal()
        this.loadDestinations() // Reload destinations
      },
      error: (error) => {
        this.updateModalState({
          isLoading: false,
          error: error.message || 'Error al guardar destino'
        })
      }
    })
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(destination: Destination): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${destination.name}"?`)) {
      this.deleteDestination(destination.id)
    }
  }

  /**
   * Eliminar destino
   */
  private deleteDestination(id: number): void {
    this.updateState({ isLoading: true })

    this.destinationService.deleteDestination(id).subscribe({
      next: () => {
        this.loadDestinations() // Reload destinations
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al eliminar destino'
        })
      }
    })
  }

  /**
   * Utilidades para template
   */
  trackByDestination(index: number, destination: Destination): number {
    return destination.id
  }

  getTypeLabel(type: string): string {
    return DESTINATION_TYPE_LABELS[type as keyof typeof DESTINATION_TYPE_LABELS] || type
  }

  getTypeStyle(type: string): string {
    switch (type) {
      case 'seaport':
        return 'bg-blue-100 text-blue-800'
      case 'warehouse_land':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  formatCapacity(capacity: number): string {
    return capacity.toLocaleString()
  }

  getTotalCapacity(): number {
    return this.filteredDestinations.reduce((total, dest) => total + dest.capacity, 0)
  }

  /**
   * Helper methods for state management (Single Responsibility Principle)
   */
  private updateState(partialState: Partial<DestinationListState>): void {
    this.stateSubject.next({ ...this.currentState, ...partialState })
  }

  private updateModalState(partialState: Partial<ModalState>): void {
    this.modalStateSubject.next({ ...this.modalState, ...partialState })
  }
}
