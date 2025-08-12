// features/panel/clients/services/client.service.ts
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseApiService } from '../../../../core/services/base-api.service'
import type {
  Client,
  ClientCreateRequest,
  ClientUpdateRequest
} from '@/core/models/client.model'
import { CLIENT_VALIDATIONS, CLIENT_MAX_LENGTHS } from '@/core/models/client.model'

// Interface para el contrato del servicio (Dependency Inversion Principle)
export interface IClientService {
  getClients(): Observable<Client[]>
  createClient(client: ClientCreateRequest): Observable<Client>
  updateClient(id: number, client: ClientUpdateRequest): Observable<Client>
  toggleActiveStatus(id: number): Observable<void>
}

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseApiService implements IClientService {
  private readonly ENDPOINTS = {
    LIST: '/catalog/client/list',
    CREATE: '/catalog/client/',
    UPDATE: (id: number) => `/catalog/client/${id}`,
    DELETE: (id: number) => `/catalog/client/${id}`,
  } as const

  /**
   * Obtener lista de clientes
   */
  getClients(): Observable<Client[]> {
    return this.get<Client[]>(this.ENDPOINTS.LIST).pipe(
      map(clients => {
        // Asegurar que los datos vienen con la estructura correcta
        return clients.map(client => ({
          ...client,
          active: Boolean(client.active)
        }))
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener clientes'))
      })
    )
  }

  /**
   * Crear nuevo cliente
   */
  createClient(client: ClientCreateRequest): Observable<Client> {
    const validatedClient = this.validateClientData(client)

    return this.post<Client>(this.ENDPOINTS.CREATE, validatedClient).pipe(
      map(createdClient => {
        return {
          ...createdClient,
          active: Boolean(createdClient.active)
        }
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al crear cliente'))
      })
    )
  }

  /**
   * Actualizar cliente existente
   */
  updateClient(id: number, client: ClientUpdateRequest): Observable<Client> {
    const validatedClient = this.validateClientData(client)

    return this.put<Client>(this.ENDPOINTS.UPDATE(id), validatedClient).pipe(
      map(updatedClient => {
        return {
          ...updatedClient,
          active: Boolean(updatedClient.active)
        }
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al actualizar cliente'))
      })
    )
  }

  /**
   * Cambiar estado activo / inactivo
   */
  toggleActiveStatus(id: number): Observable<void> {
    return this.delete<void>(this.ENDPOINTS.DELETE(id)).pipe(
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al eliminar cliente'))
      })
    )
  }

  /**
   * Validar datos del cliente (Single Responsibility Principle)
   */
  private validateClientData(client: ClientCreateRequest | ClientUpdateRequest): any {
    // Validar tipo de cliente
    const validTypes = ['national', 'international']
    if (!client.type || !validTypes.includes(client.type)) {
      throw new Error('El tipo de cliente debe ser nacional o internacional')
    }

    // Validar nombre
    if (!client.full_name?.trim()) {
      throw new Error('El nombre es requerido')
    }

    if (client.full_name.length > CLIENT_MAX_LENGTHS.FULL_NAME) {
      throw new Error(`El nombre no puede exceder ${CLIENT_MAX_LENGTHS.FULL_NAME} caracteres`)
    }

    if (!CLIENT_VALIDATIONS.FULL_NAME.test(client.full_name.trim())) {
      throw new Error('El nombre solo debe contener letras y espacios')
    }

    // Validar email - CRÍTICO
    if (!client.email?.trim()) {
      throw new Error('El email es requerido')
    }

    const emailTrimmed = client.email.trim().toLowerCase()

    if (emailTrimmed.length > CLIENT_MAX_LENGTHS.EMAIL) {
      throw new Error(`El email no puede exceder ${CLIENT_MAX_LENGTHS.EMAIL} caracteres`)
    }

    if (!CLIENT_VALIDATIONS.EMAIL.test(emailTrimmed)) {
      throw new Error('El formato del email no es válido. Ejemplo: usuario@ejemplo.com')
    }

    // Validaciones adicionales de email
    if (emailTrimmed.includes('..')) {
      throw new Error('El email no puede contener puntos consecutivos')
    }

    if (emailTrimmed.startsWith('.') || emailTrimmed.startsWith('@')) {
      throw new Error('El email no puede empezar con punto o @')
    }

    // Validar dirección
    if (!client.address?.trim()) {
      throw new Error('La dirección es requerida')
    }

    if (client.address.length > CLIENT_MAX_LENGTHS.ADDRESS) {
      throw new Error(`La dirección no puede exceder ${CLIENT_MAX_LENGTHS.ADDRESS} caracteres`)
    }

    // Validar teléfono
    if (!client.phone?.trim()) {
      throw new Error('El teléfono es requerido')
    }

    const phoneCleaned = client.phone.replace(/[\s\-\(\)]/g, '')

    if (phoneCleaned.length < 7 || phoneCleaned.length > CLIENT_MAX_LENGTHS.PHONE) {
      throw new Error('El teléfono debe tener entre 7 y 20 dígitos')
    }

    if (!CLIENT_VALIDATIONS.PHONE.test(client.phone)) {
      throw new Error('El formato del teléfono no es válido')
    }

    // Validar estado activo
    if (typeof client.active !== 'boolean') {
      throw new Error('El estado activo debe ser verdadero o falso')
    }

    // Retornar datos validados y normalizados
    return {
      name: client.full_name.trim(),
      email: emailTrimmed,
      address: client.address.trim(),
      phone: client.phone.trim(),
      type: client.type,
      active: Boolean(client.active)
    }
  }

  /**
   * Validar si un email ya existe (para usar antes de crear/actualizar)
   */
  validateEmailUniqueness(email: string, excludeId?: number): Observable<boolean> {
    // Esta función podría llamar a un endpoint específico si el backend lo proporciona
    // Por ahora, retornamos true (email es único)
    return new Observable(observer => {
      observer.next(true)
      observer.complete()
    })
  }

  /**
   * Manejar errores de forma consistente (Single Responsibility Principle)
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error.status === 0) {
      return new Error('Error de conexión. Verifica tu internet.')
    }

    if (error.status === 401) {
      return new Error('No tienes permisos para realizar esta acción.')
    }

    if (error.status === 404) {
      return new Error('El cliente no fue encontrado.')
    }

    if (error.status === 409) {
      return new Error('Ya existe un cliente con ese email.')
    }

    if (error.status === 422) {
      // Intentar obtener mensaje específico del backend
      if (error.error?.errors?.email) {
        return new Error('El email ya está registrado con otro cliente.')
      }
      return new Error('Datos inválidos. Verifica el formulario.')
    }

    return new Error(error.error?.message || defaultMessage)
  }
}
