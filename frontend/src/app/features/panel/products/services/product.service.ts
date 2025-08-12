// features/panel/products/services/product.service.ts
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseApiService } from '../../../../core/services/base-api.service'
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest
} from '@/core/models/product.model'

// Interface para el contrato del servicio (Dependency Inversion Principle)
export interface IProductService {
  getProducts(): Observable<Product[]>
  createProduct(product: ProductCreateRequest): Observable<Product>
  updateProduct(id: number, product: ProductUpdateRequest): Observable<Product>
  deleteProduct(id: number): Observable<void>
}

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService implements IProductService {
  private readonly ENDPOINTS = {
    LIST: '/catalog/product/list',
    CREATE: '/catalog/product/',
    UPDATE: (id: number) => `/catalog/product/${id}`,
    DELETE: (id: number) => `/catalog/product/${id}`,
  } as const

  /**
   * Obtener lista de productos
   */
  getProducts(): Observable<Product[]> {
    return this.get<Product[]>(this.ENDPOINTS.LIST).pipe(
      map(products => {
        return products
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al obtener productos'))
      })
    )
  }

  /**
   * Crear nuevo producto
   */
  createProduct(product: ProductCreateRequest): Observable<Product> {
    const validatedProduct = this.validateProductData(product)

    return this.post<Product>(this.ENDPOINTS.CREATE, validatedProduct).pipe(
      map(createdProduct => {
        return createdProduct
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al crear producto'))
      })
    )
  }

  /**
   * Actualizar producto existente
   */
  updateProduct(id: number, product: ProductUpdateRequest): Observable<Product> {
    const validatedProduct = this.validateProductData(product)

    return this.put<Product>(this.ENDPOINTS.UPDATE(id), validatedProduct).pipe(
      map(updatedProduct => {
        return updatedProduct
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al actualizar producto'))
      })
    )
  }

  /**
   * Eliminar producto
   */
  deleteProduct(id: number): Observable<void> {

    return this.delete<void>(this.ENDPOINTS.DELETE(id)).pipe(
      map(() => {
      }),
      catchError(error => {
        return throwError(() => this.handleError(error, 'Error al eliminar producto'))
      })
    )
  }

  /**
   * Validar datos del producto (Single Responsibility Principle)
   */
  private validateProductData(product: ProductCreateRequest | ProductUpdateRequest): any {
    const validTypes = ['maritime', 'terrestrial']

    if (!product.name?.trim()) {
      throw new Error('El nombre del producto es requerido')
    }

    if (!product.description?.trim()) {
      throw new Error('La descripción del producto es requerida')
    }

    if (!product.type || !validTypes.includes(product.type)) {
      throw new Error('El tipo de producto debe ser marítimo o terrestre')
    }

    if (!product.date_creation) {
      throw new Error('La fecha de creación es requerida')
    }

    return {
      name: product.name.trim(),
      description: product.description.trim(),
      type: product.type,
      date_creation: product.date_creation
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
      return new Error('El producto no fue encontrado.')
    }

    if (error.status === 422) {
      return new Error('Datos inválidos. Verifica el formulario.')
    }

    return new Error(error.error?.message || defaultMessage)
  }
}
