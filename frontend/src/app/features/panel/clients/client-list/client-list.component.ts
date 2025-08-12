import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { ClientService } from '../services/client.service'
import { ClientModalComponent, type ClientSaveEvent } from '../client-modal/client-modal.component'
import type { Client } from '@/core/models/client.model'
import { CLIENT_TYPE_LABELS } from '@/core/models/client.model'

// Interface para el estado del componente
interface ClientListState {
  clients: Client[]
  filteredClients: Client[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  sortColumn: keyof Client | null
  sortDirection: 'asc' | 'desc'
}

// Interface para las acciones del modal
interface ModalState {
  isOpen: boolean
  isLoading: boolean
  error: string
  editingClient: Client | null
}

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, FormsModule, ClientModalComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService)

  // State management
  private stateSubject = new BehaviorSubject<ClientListState>({
    clients: [],
    filteredClients: [],
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
    editingClient: null
  })

  // Public observables
  state$ = this.stateSubject.asObservable()
  modalState$ = this.modalStateSubject.asObservable()

  // Current state getters
  get currentState() { return this.stateSubject.value }
  get modalState() { return this.modalStateSubject.value }

  // Expose to template
  get clients() { return this.currentState.clients }
  get filteredClients() { return this.currentState.filteredClients }
  get isLoading() { return this.currentState.isLoading }
  get error() { return this.currentState.error }
  get searchTerm() { return this.currentState.searchTerm }
  get sortColumn() { return this.currentState.sortColumn }
  get sortDirection() { return this.currentState.sortDirection }

  private typeFilter = ''
  private activeFilter = ''

  readonly CLIENT_TYPE_LABELS = CLIENT_TYPE_LABELS

  ngOnInit(): void {
    this.loadClients()
  }

  /**
   * Cargar clientes desde el API
   */
  loadClients(): void {
    this.updateState({ isLoading: true, error: null })

    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.updateState({
          clients,
          filteredClients: clients,
          isLoading: false
        })
      },
      error: (error) => {
        this.updateState({
          isLoading: false,
          error: error.message || 'Error al cargar clientes'
        })
      }
    })
  }

  /**
   * Buscar clientes
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement
    const searchTerm = target.value.toLowerCase()

    this.updateState({ searchTerm })
    this.applyAllFilters()
  }

  /**
   * Filtrar por tipo
   */
  onTypeFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    this.typeFilter = target.value
    this.applyAllFilters()
  }

  /**
   * Filtrar por estado activo
   */
  onActiveFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    this.activeFilter = target.value
    this.applyAllFilters()
  }

  /**
   * Aplicar todos los filtros
   */
  private applyAllFilters(): void {
    let filtered = this.currentState.clients

    // Aplicar búsqueda
    if (this.currentState.searchTerm) {
      const searchTerm = this.currentState.searchTerm.toLowerCase()
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm) ||
        client.address.toLowerCase().includes(searchTerm)
      )
    }

    // Aplicar filtro de tipo
    if (this.typeFilter) {
      filtered = filtered.filter(client => client.type === this.typeFilter)
    }

    // Aplicar filtro de estado
    if (this.activeFilter === 'true') {
      filtered = filtered.filter(client => client.active)
    } else if (this.activeFilter === 'false') {
      filtered = filtered.filter(client => !client.active)
    }

    this.updateState({
      filteredClients: this.applySorting(filtered)
    })
  }

  /**
   * Ordenar por columna
   */
  sortBy(column: keyof Client): void {
    const currentSort = this.currentState.sortColumn
    const currentDirection = this.currentState.sortDirection

    const newDirection = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc'

    this.updateState({
      sortColumn: column,
      sortDirection: newDirection,
      filteredClients: this.applySorting(this.currentState.filteredClients, column, newDirection)
    })
  }

  /**
   * Toggle sort
   */
  toggleSort(): void {
    if (this.currentState.sortColumn) {
      const newDirection = this.currentState.sortDirection === 'asc' ? 'desc' : 'asc'
      this.sortBy(this.currentState.sortColumn)
    } else {
      this.sortBy('full_name')
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    clients: Client[],
    column?: keyof Client,
    direction?: 'asc' | 'desc'
  ): Client[] {
    const sortColumn = column || this.currentState.sortColumn
    const sortDirection = direction || this.currentState.sortDirection

    if (!sortColumn) return clients

    return [...clients].sort((a, b) => {
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
  toggleActiveStatus(client: Client): void {
    const updatedClient = {
      name: client.full_name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      type: client.type,
      active: !client.active
    }

    this.clientService.toggleActiveStatus(client.id).subscribe({
      next: () => {
        this.loadClients()
      },
      error: (error) => {
        this.updateState({
          error: error.message || 'Error al cambiar estado del cliente'
        })
      }
    })
  }

  /**
   * Abrir modal para crear cliente
   */
  openCreateModal(): void {
    this.updateModalState({
      isOpen: true,
      editingClient: null,
      error: ''
    })
  }

  /**
   * Abrir modal para editar cliente
   */
  openEditModal(client: Client): void {
    this.updateModalState({
      isOpen: true,
      editingClient: client,
      error: ''
    })
  }

  /**
   * Cerrar modal
   */
  closeModal(): void {
    this.updateModalState({
      isOpen: false,
      editingClient: null,
      error: '',
      isLoading: false
    })
  }

  /**
   * Guardar cliente
   */
  onSaveClient(event: ClientSaveEvent): void {
    this.updateModalState({ isLoading: true, error: '' })

    const operation = event.isEdit && this.modalState.editingClient
      ? this.clientService.updateClient(this.modalState.editingClient.id, event.client)
      : this.clientService.createClient(event.client)

    operation.subscribe({
      next: () => {
        this.updateModalState({ isLoading: false })
        this.closeModal()
        this.loadClients()
      },
      error: (error) => {
        this.updateModalState({
          isLoading: false,
          error: error.message || 'Error al guardar cliente'
        })
      }
    })
  }

  /**
   * Utilidades para template
   */
  trackByClient(index: number, client: Client): number {
    return client.id
  }

  getClientTypeLabel(type: string): string {
    return CLIENT_TYPE_LABELS[type as keyof typeof CLIENT_TYPE_LABELS] || type
  }

  getClientTypeStyle(type: string): string {
    switch (type) {
      case 'national':
        return 'bg-blue-100 text-blue-800'
      case 'international':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  getActiveStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo'
  }

  getActiveStatusStyle(active: boolean): string {
    return active
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  getActiveCount(): number {
    return this.filteredClients.filter(c => c.active).length
  }

  getInactiveCount(): number {
    return this.filteredClients.filter(c => !c.active).length
  }

  /**
   * Helper methods for state management
   */
  private updateState(partialState: Partial<ClientListState>): void {
    this.stateSubject.next({ ...this.currentState, ...partialState })
  }

  private updateModalState(partialState: Partial<ModalState>): void {
    this.modalStateSubject.next({ ...this.modalState, ...partialState })
  }
}
