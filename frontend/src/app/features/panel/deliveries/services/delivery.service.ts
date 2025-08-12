// features/panel/deliveries/services/delivery.service.ts
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseApiService } from '../../../../core/services/base-api.service'
import type { Delivery } from '@/core/models/delivery.model'

// Interface para el contrato del servicio
export interface IDeliveryService {
  getDeliveries(): Observable<Delivery[]>
}

@Injectable({
  providedIn: 'root',
})
export class DeliveryService extends BaseApiService implements IDeliveryService {
  private readonly ENDPOINTS = {
    LIST: '/logistic/delivery/list',
  } as const

  /**
   * Obtener lista de entregas
   */
  getDeliveries(): Observable<Delivery[]> {
    return this.get<Delivery[]>(this.ENDPOINTS.LIST).pipe(
      map(deliveries => {
        // Validar y transformar los datos si es necesario
        return deliveries.map(delivery => ({
          ...delivery,
          // Asegurar que los precios sean strings con formato decimal
          shipping_price: this.formatPrice(delivery.shipping_price),
          final_price: this.formatPrice(delivery.final_price),
          // Normalizar fechas
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
   * Formatear precio para consistencia (Single Responsibility Principle)
   */
  private formatPrice(price: string | number): string {
    if (typeof price === 'number') {
      return price.toFixed(2)
    }

    // Si ya es string, verificar que tenga formato decimal
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }

  /**
   * Formatear fecha para consistencia (Single Responsibility Principle)
   */
  private formatDate(date: string): string {
    try {
      // Intentar parsear y reformatear la fecha
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) {
        return date // Retornar fecha original si no se puede parsear
      }

      // Formato YYYY-MM-DD
      return parsedDate.toISOString().split('T')[0]
    } catch {
      return date // Retornar fecha original en caso de error
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
      return new Error('No tienes permisos para acceder a esta información.')
    }

    if (error.status === 404) {
      return new Error('No se encontraron entregas.')
    }

    if (error.status === 500) {
      return new Error('Error interno del servidor. Intenta más tarde.')
    }

    return new Error(error.error?.message || defaultMessage)
  }
}
