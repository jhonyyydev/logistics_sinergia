import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BehaviorSubject } from 'rxjs'
import { TransportService } from '../services/transport.service'
import { TransportModalComponent, type TransportSaveEvent } from '../transport-modal/transport-modal.component'
import type { Transport } from '@/core/models/transport.model'
import { TRANSPORT_UNIT_TYPE_LABELS } from '@/core/models/transport.model'

// Interface para el estado del componente
interface TransportListState {
  transports: Transport[]
  filteredTransports: Transport[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  sortColumn: keyof Transport | null
  sortDirection: 'asc' | 'desc'
}

// Interface para las acciones del modal
interface ModalState {
  isOpen: boolean
  isLoading: boolean
  error: string
  editingTransport: Transport | null
}

@Component({
  selector: 'app-transport-list',
  imports: [CommonModule, TransportModalComponent],
  templateUrl: './transport-list.component.html',
  styleUrl: './transport-list.component.scss'
})
export class TransportListComponent implements OnInit {
  private transportService = inject(TransportService)

  // State management
  private stateSubject = new BehaviorSubject<TransportListState>({
    transports: [],
    filteredTransports: [],
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
    editingTransport: null
  })

  // Public observables
  state$ = this.stateSubject.asObservable()
  modalState$ = this.modalStateSubject.asObservable()

  // Current state getters
  get currentState() { return this.stateSubject.value }
  get modalState() { return this.modalStateSubject.value }

  // Expose to template
  get transports() { return this.currentState.transports }
  get filteredTransports() { return this.currentState.filteredTransports }
  get isLoading() { return this.currentState.isLoading }
  get error() { return this.currentState.error }
  get searchTerm() { return this.currentState.searchTerm }
  get sortColumn() { return this.currentState.sortColumn }
  get sortDirection() { return this.currentState.sortDirection }

  readonly TRANSPORT_UNIT_TYPE_LABELS = TRANSPORT_UNIT_TYPE_LABELS

  ngOnInit(): void {
    this.loadTransports()
  }

  /**
   * Cargar transportes desde el API
   */
  loadTransports(): void {
    this.updateState({ isLoading: true, error: null })

    this.transportService.getTransports().subscribe({
      next: (transports) => {
        this.updateState({
          transports,
          filteredTransports: transports,
          isLoading: false
        })
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al cargar transportes'
        })
      }
    })
  }

  /**
   * Buscar transportes
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement
    const searchTerm = target.value.toLowerCase()

    const filtered = this.currentState.transports.filter(transport =>
      transport.identifier.toLowerCase().includes(searchTerm) ||
      this.getUnitTypeLabel(transport.type).toLowerCase().includes(searchTerm)
    )

    this.updateState({
      searchTerm,
      filteredTransports: this.applySorting(filtered)
    })
  }

  /**
   * Filtrar por estado activo
   */
  onActiveFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    const activeFilter = target.value

    let filtered = this.currentState.transports

    if (activeFilter === 'true') {
      filtered = filtered.filter(transport => transport.active)
    } else if (activeFilter === 'false') {
      filtered = filtered.filter(transport => !transport.active)
    }

    // Aplicar búsqueda si existe
    if (this.currentState.searchTerm) {
      const searchTerm = this.currentState.searchTerm.toLowerCase()
      filtered = filtered.filter(transport =>
        transport.identifier.toLowerCase().includes(searchTerm) ||
        this.getUnitTypeLabel(transport.type).toLowerCase().includes(searchTerm)
      )
    }

    this.updateState({
      filteredTransports: this.applySorting(filtered)
    })
  }

  /**
   * Ordenar por columna
   */
  sortBy(column: keyof Transport): void {
    const currentSort = this.currentState.sortColumn
    const currentDirection = this.currentState.sortDirection

    const newDirection = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc'

    this.updateState({
      sortColumn: column,
      sortDirection: newDirection,
      filteredTransports: this.applySorting(this.currentState.filteredTransports, column, newDirection)
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
      this.sortBy('identifier')
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    transports: Transport[],
    column?: keyof Transport,
    direction?: 'asc' | 'desc'
  ): Transport[] {
    const sortColumn = column || this.currentState.sortColumn
    const sortDirection = direction || this.currentState.sortDirection

    if (!sortColumn) return transports

    return [...transports].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  /**
   * Toggle active status
   */
  toggleActiveStatus(transport: Transport): void {
    this.transportService.toggleActiveStatus(transport.id).subscribe({
      next: () => {
        this.loadTransports() // Reload transports
      },
      error: (error) => {
        this.updateState({
          error: error.message || 'Error al cambiar estado del transporte'
        })
      }
    })
  }

  /**
   * Abrir modal para crear transporte
   */
  openCreateModal(): void {
    this.updateModalState({
      isOpen: true,
      editingTransport: null,
      error: ''
    })
  }

  /**
   * Abrir modal para editar transporte
   */
  openEditModal(transport: Transport): void {
    this.updateModalState({
      isOpen: true,
      editingTransport: transport,
      error: ''
    })
  }

  /**
   * Cerrar modal
   */
  closeModal(): void {
    this.updateModalState({
      isOpen: false,
      editingTransport: null,
      error: '',
      isLoading: false
    })
  }

  /**
   * Guardar transporte (crear o editar)
   */
  onSaveTransport(event: TransportSaveEvent): void {
    this.updateModalState({ isLoading: true, error: '' })

    const operation = event.isEdit && this.modalState.editingTransport
      ? this.transportService.updateTransport(this.modalState.editingTransport.id, event.transport)
      : this.transportService.createTransport(event.transport)

    operation.subscribe({
      next: () => {
        this.updateModalState({ isLoading: false })
        this.closeModal()
        this.loadTransports() // Reload transports
      },
      error: (error) => {
        this.updateModalState({
          isLoading: false,
          error: error.message || 'Error al guardar transporte'
        })
      }
    })
  }

  /**
   * Utilidades para template
   */
  trackByTransport(index: number, transport: Transport): number {
    return transport.id
  }

  getUnitTypeLabel(unit_type: string): string {
    return TRANSPORT_UNIT_TYPE_LABELS[unit_type as keyof typeof TRANSPORT_UNIT_TYPE_LABELS] || unit_type
  }

  getUnitTypeStyle(unit_type: string): string {
    switch (unit_type) {
      case 'fleet':
        return 'bg-purple-100 text-purple-800'
      case 'vehicle':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  getActiveStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo'
  }

  getActiveStatusIcon(active: boolean): string {
    return active ? 'Actived' : 'Inactived'
  }

  getActiveStatusStyle(active: boolean): string {
    return active
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  getActiveCount(): number {
    return this.filteredTransports.filter(t => t.active).length
  }

  getInactiveCount(): number {
    return this.filteredTransports.filter(t => !t.active).length
  }

  /**
   * Helper methods for state management (Single Responsibility Principle)
   */
  private updateState(partialState: Partial<TransportListState>): void {
    this.stateSubject.next({ ...this.currentState, ...partialState })
  }

  private updateModalState(partialState: Partial<ModalState>): void {
    this.modalStateSubject.next({ ...this.modalState, ...partialState })
  }
}
