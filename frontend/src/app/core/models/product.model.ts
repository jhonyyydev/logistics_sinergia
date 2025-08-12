// features/panel/products/models/product.model.ts

export type ProductType = 'maritime' | 'terrestrial'

export interface Product {
  id: number
  name: string
  description: string
  type: ProductType
  date_creation: string
}

export interface ProductCreateRequest {
  name: string
  description: string
  type: ProductType
  date_creation: string
}

export interface ProductUpdateRequest {
  name: string
  description: string
  type: ProductType
  date_creation: string
}

export interface ProductFormData {
  name: string
  description: string
  type: ProductType
  date_creation: string
}

// Enum para los tipos de producto
export const PRODUCT_TYPES = {
  MARITIME: 'maritime' as ProductType,
  TERRESTRIAL: 'terrestrial' as ProductType
} as const

// Labels para mostrar en UI
export const PRODUCT_TYPE_LABELS = {
  maritime: 'Marítimo',
  terrestrial: 'Terrestre'
} as const
