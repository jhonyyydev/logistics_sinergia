export type DeliveryType = 'maritime' | 'terrestrial'
export type ProductType = 'electronics' | 'clothing' | 'food' | 'furniture' | 'books' | 'toys'

export interface Delivery {
  id?: number
  user_id: number
  product_id: number
  product_type: ProductType
  quantity: number
  log_date: string
  delivery_date: string
  shipping_price: number
  guide: string
  delivery_type: DeliveryType
  transport_unit_id: number
  destination_id: number
}

export interface DeliveryCreateRequest {
  user_id: number
  product_id: number
  product_type: ProductType
  quantity: number
  log_date: string
  delivery_date: string
  shipping_price: number
  guide: string
  delivery_type: DeliveryType
  transport_unit_id: number
  destination_id: number
}

export interface DeliveryFormData {
  product_id: number
  product_type: ProductType
  quantity: number
  log_date: string
  delivery_date: string
  shipping_price: number
  guide: string
  transport_unit_id: number
  destination_id: number
}

// Interfaces para los selects
export interface ProductSelect {
  id: number
  name: string
  type: DeliveryType
}

export interface TransportUnitSelect {
  id: number
  unit_type: 'fleet' | 'vehicle'
  identifier: string
}

export interface DestinationSelect {
  id: number
  name: string
  destination_type: 'seaport' | 'warehouse_land'
}

