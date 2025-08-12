// features/panel/destinations/services/destination.service.ts
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseApiService } from '../../../../core/services/base-api.service'
import type {
  Destination,
  DestinationCreateRequest,
  DestinationUpdateRequest
} from '@/core/models/destination.model'

export interface IDestinationService {
  getDestinations(): Observable<Destination[]>
  createDestination(destination: DestinationCreateRequest): Observable<Destination>
  updateDestination(id: number, destination: DestinationUpdateRequest): Observable<Destination>
  deleteDestination(id: number): Observable<void>
}

@Injectable({
  providedIn: 'root',
})
export class DestinationService extends BaseApiService implements IDestinationService {

  private readonly ENDPOINTS = {
    LIST: '/catalog/destination/list',
    CREATE: '/catalog/destination/',
    UPDATE: (id: number) => `/catalog/destination/${id}`,
    DELETE: (id: number) => `/catalog/destination/${id}`,
  } as const

  /**
   * Obtener lista de destinos
   */
  getDestinations(): Observable<Destination[]> {
    return this.get<Destination[]>(this.ENDPOINTS.LIST).pipe(
      map(destinations => {
        return destinations
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener destinos'))
      })
    )
  }

  /**
   * Crear nuevo destino
   */
  createDestination(destination: DestinationCreateRequest): Observable<Destination> {
    const validatedDestination = this.validateDestinationData(destination)

    return this.post<Destination>(this.ENDPOINTS.CREATE, validatedDestination).pipe(
      map(createdDestination => {
        return createdDestination
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al crear destino'))
      })
    )
  }

  /**
   * Actualizar destino existente
   */
  updateDestination(id: number, destination: DestinationUpdateRequest): Observable<Destination> {
    const validatedDestination = this.validateDestinationData(destination)

    return this.put<Destination>(this.ENDPOINTS.UPDATE(id), validatedDestination).pipe(
      map(updatedDestination => {
        return updatedDestination
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al actualizar destino'))
      })
    )
  }

  /**
   * Eliminar destino
   */
  deleteDestination(id: number): Observable<void> {
    return this.delete<void>(this.ENDPOINTS.DELETE(id)).pipe(
      map(() => {
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al eliminar destino'))
      })
    )
  }

  /**
   * Validar datos del destino (Single Responsibility Principle)
   */
  private validateDestinationData(destination: DestinationCreateRequest | DestinationUpdateRequest): any {
    const validTypes = ['seaport', 'warehouse_land']

    if (!destination.name?.trim()) {
      throw new Error('El nombre del destino es requerido')
    }

    if (!destination.location?.trim()) {
      throw new Error('La ubicación del destino es requerida')
    }

    if (!destination.capacity || destination.capacity <= 0) {
      throw new Error('La capacidad debe ser mayor a 0')
    }

    if (!destination.type || !validTypes.includes(destination.type)) {
      throw new Error('El tipo de destino debe ser puerto marítimo o almacén terrestre')
    }

    return {
      name: destination.name.trim(),
      location: destination.location.trim(),
      capacity: Number(destination.capacity),
      destination_type: destination.type
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
      return new Error('El destino no fue encontrado.')
    }

    if (error.status === 422) {
      return new Error('Datos inválidos. Verifica el formulario.')
    }

    return new Error(error.error?.message || defaultMessage)
  }
}
