import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseApiService } from '../../../../core/services/base-api.service'
import type {
  Transport,
  TransportCreateRequest,
  TransportUpdateRequest
} from '@/core/models/transport.model'
import { TRANSPORT_FORMATS } from '@/core/models/transport.model'

// Interface para el contrato del servicio (Dependency Inversion Principle)
export interface ITransportService {
  getTransports(): Observable<Transport[]>
  createTransport(transport: TransportCreateRequest): Observable<Transport>
  updateTransport(id: number, transport: TransportUpdateRequest): Observable<Transport>
  toggleActiveStatus(id: number): Observable<void>
}

@Injectable({
  providedIn: 'root',
})
export class TransportService extends BaseApiService implements ITransportService {
  private readonly ENDPOINTS = {
    LIST: '/catalog/transport/list',
    CREATE: '/catalog/transport/',
    UPDATE: (id: number) => `/catalog/transport/${id}`,
    DELETE: (id: number) => `/catalog/transport/${id}`,
  } as const

  /**
   * Obtener lista de transportes
   */
  getTransports(): Observable<Transport[]> {
    return this.get<Transport[]>(this.ENDPOINTS.LIST).pipe(
      map(transports => {
        return transports
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener transportes'))
      })
    )
  }

  /**
   * Crear nuevo transporte
   */
  createTransport(transport: TransportCreateRequest): Observable<Transport> {
    const validatedTransport = this.validateTransportData(transport)

    return this.post<Transport>(this.ENDPOINTS.CREATE, validatedTransport).pipe(
      map(createdTransport => {
        return createdTransport
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al crear transporte'))
      })
    )
  }

  /**
   * Actualizar transporte existente
   */
  updateTransport(id: number, transport: TransportUpdateRequest): Observable<Transport> {
    const validatedTransport = this.validateTransportData(transport)

    return this.put<Transport>(this.ENDPOINTS.UPDATE(id), validatedTransport).pipe(
      map(updatedTransport => {
        return updatedTransport
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al actualizar transporte'))
      })
    )
  }

  /**
   * Cambiar estado transporte
   */
  toggleActiveStatus(id: number): Observable<void> {
    return this.delete<void>(this.ENDPOINTS.DELETE(id)).pipe(
      map(() => {
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al eliminar transporte'))
      })
    )
  }

  /**
   * Validar datos del transporte (Single Responsibility Principle)
   */
  private validateTransportData(transport: TransportCreateRequest | TransportUpdateRequest): any {
    const validTypes = ['fleet', 'vehicle']

    if (!transport.type || !validTypes.includes(transport.type)) {
      throw new Error('El tipo de unidad debe ser flota o vehículo')
    }

    if (!transport.identifier?.trim()) {
      throw new Error('El identificador es requerido')
    }

    // Validación crítica del formato según el tipo
    const identifier = transport.identifier.trim().toUpperCase()

    if (transport.type === 'vehicle') {
      if (!TRANSPORT_FORMATS.VEHICLE.test(identifier)) {
        throw new Error('Formato de placa inválido. Debe ser 3 letras y 3 números (ej: ABC123)')
      }
    } else if (transport.type === 'fleet') {
      if (!TRANSPORT_FORMATS.FLEET.test(identifier)) {
        throw new Error('Formato de flota inválido. Debe ser 3 letras, 4 números y 1 letra (ej: ABC1234Z)')
      }
    }

    // active debe ser un boolean
    if (typeof transport.active !== 'boolean') {
      throw new Error('El estado activo debe ser verdadero o falso')
    }

    return {
      identifier: identifier, // Convertir a mayúsculas para consistencia
      unit_type: transport.type,
      active: Boolean(transport.active)
    }
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
      return new Error('El transporte no fue encontrado.')
    }

    if (error.status === 422) {
      return new Error('Datos inválidos. Verifica el formulario.')
    }

    return new Error(error.error?.message || defaultMessage)
  }
}
