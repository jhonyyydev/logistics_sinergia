import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { BaseApiService } from "../../../core/services/base-api.service"
import type { Product, ProductRequest } from "../../../core/models/product.model"

@Injectable({
  providedIn: "root",
})
export class ProductService extends BaseApiService {
  private readonly endpoint = "/catalog/product"

  getProducts(): Observable<{ data: Product[] }> {
    return this.get<{ data: Product[] }>(`${this.endpoint}/list`)
  }

  getProduct(id: number): Observable<{ data: Product }> {
    return this.get<{ data: Product }>(`/product/${id}`)
  }

  createProduct(product: ProductRequest): Observable<{ data: Product }> {
    return this.post<{ data: Product }>("/product", product)
  }

  updateProduct(id: number, product: ProductRequest): Observable<{ data: Product }> {
    return this.put<{ data: Product }>(`/product/${id}`, product)
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.delete<{ message: string }>(`/product/${id}`)
  }
}
