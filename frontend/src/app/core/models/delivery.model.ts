export type DeliveryType = 'terrestrial' | 'maritime' | 'aerial'
export type ProductType = 'electronics' | 'clothing' | 'food' | 'furniture' | 'books' | 'toys'

export interface DeliveryUser {
  id: number
  name: string
  email: string
}

export interface TransportUnit {
  id: number
  identifier: string
}

export interface DeliveryDestination {
  id: number
  name: string
  location: string
}

export interface Delivery {
  id: number
  user: DeliveryUser
  product_id: number
  product_type: ProductType
  quantity: number
  log_date: string
  delivery_date: string
  shipping_price: string
  final_price: string
  guide: string
  delivery_type: DeliveryType
  transport_unit: TransportUnit
  destination: DeliveryDestination
}

// Enum para los tipos de entrega
export const DELIVERY_TYPES = {
  TERRESTRIAL: 'terrestrial' as DeliveryType,
  MARITIME: 'maritime' as DeliveryType,
} as const

// Labels para mostrar en UI
export const DELIVERY_TYPE_LABELS = {
  terrestrial: 'Terrestre',
  maritime: 'Marítimo',
} as const

// Enum para los tipos de producto
export const PRODUCT_TYPES = {
  ELECTRONICS: 'electronics' as ProductType,
  CLOTHING: 'clothing' as ProductType,
  FOOD: 'food' as ProductType,
  FURNITURE: 'furniture' as ProductType,
  BOOKS: 'books' as ProductType,
  TOYS: 'toys' as ProductType
} as const

// Labels para tipos de producto
export const PRODUCT_TYPE_LABELS = {
  electronics: 'Electrónicos',
  clothing: 'Ropa',
  food: 'Alimentos',
  furniture: 'Muebles',
  books: 'Libros',
  toys: 'Juguetes'
} as const
