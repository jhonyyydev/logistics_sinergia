// features/panel/deliveries/services/delivery.service.ts

import { Injectable } from '@angular/core'
import { Observable, throwError, forkJoin } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseApiService } from '../../../../core/services/base-api.service'
import type {
  Delivery,
  DeliveryCreateRequest,
  ProductSelect,
  TransportUnitSelect,
  DestinationSelect
} from '@/core/models/delivery-form.model'

// Interface para el contrato del servicio
export interface IDeliveryService {
  getDeliveries(): Observable<Delivery[]>
  createDelivery(delivery: DeliveryCreateRequest): Observable<Delivery>
  getProducts(): Observable<ProductSelect[]>
  getTransportUnits(): Observable<TransportUnitSelect[]>
  getDestinations(): Observable<DestinationSelect[]>
  getSelectData(): Observable<{
    products: ProductSelect[]
    transportUnits: TransportUnitSelect[]
    destinations: DestinationSelect[]
  }>
}

@Injectable({
  providedIn: 'root',
})
export class DeliveryService extends BaseApiService implements IDeliveryService {
  private readonly ENDPOINTS = {
    LIST: '/logistics/delivery',
    CREATE: '/logistics/delivery',
    PRODUCTS: '/catalog/product/select',
    TRANSPORT_UNITS: '/catalog/transport/select',
    DESTINATIONS: '/catalog/destination/select'
  } as const

  /**
   * Obtener lista de entregas
   */
  getDeliveries(): Observable<Delivery[]> {
    return this.get<Delivery[]>(this.ENDPOINTS.LIST).pipe(
      map(deliveries => {
        return deliveries.map(delivery => ({
          ...delivery,
          shipping_price: this.formatPrice(delivery.shipping_price),
          log_date: this.formatDate(delivery.log_date),
          delivery_date: this.formatDate(delivery.delivery_date)
        }))
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener entregas'))
      })
    )
  }

  /**
   * Crear nueva entrega
   */
  createDelivery(delivery: DeliveryCreateRequest): Observable<Delivery> {
    return this.post<Delivery>(this.ENDPOINTS.CREATE, delivery).pipe(
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al crear la entrega'))
      })
    )
  }

  /**
   * Obtener productos para select
   */
  getProducts(): Observable<ProductSelect[]> {
    return this.get<ProductSelect[]>(this.ENDPOINTS.PRODUCTS).pipe(
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener productos'))
      })
    )
  }

  /**
   * Obtener unidades de transporte para select
   */
  getTransportUnits(): Observable<TransportUnitSelect[]> {
    return this.get<TransportUnitSelect[]>(this.ENDPOINTS.TRANSPORT_UNITS).pipe(
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener unidades de transporte'))
      })
    )
  }

  /**
   * Obtener destinos para select
   */
  getDestinations(): Observable<DestinationSelect[]> {
    return this.get<DestinationSelect[]>(this.ENDPOINTS.DESTINATIONS).pipe(
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener destinos'))
      })
    )
  }

  /**
   * Obtener todos los datos de selects en paralelo
   */
  getSelectData(): Observable<{
    products: ProductSelect[]
    transportUnits: TransportUnitSelect[]
    destinations: DestinationSelect[]
  }> {
    return forkJoin({
      products: this.getProducts(),
      transportUnits: this.getTransportUnits(),
      destinations: this.getDestinations()
    })
  }

  /**
   * Formatear precio para consistencia
   */
  private formatPrice(price: string | number): number {
    if (typeof price === 'number') {
      return price
    }

    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? 0 : numPrice
  }

  /**
   * Formatear fecha para consistencia
   */
  private formatDate(date: string): string {
    try {
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) {
        return date
      }

      return parsedDate.toISOString().split('T')[0]
    } catch {
      return date
    }
  }

  /**
   * Manejar errores de forma consistente
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error.status === 0) {
      return new Error('Error de conexión. Verifica tu internet.')
    }

    if (error.status === 401) {
      return new Error('No tienes permisos para realizar esta acción.')
    }

    if (error.status === 404) {
      return new Error('Recurso no encontrado.')
    }

    if (error.status === 422) {
      return new Error('Datos inválidos. Verifica la información ingresada.')
    }

    if (error.status === 500) {
      return new Error('Error interno del servidor. Intenta más tarde.')
    }

    return new Error(error.error?.message || defaultMessage)
  }
}
