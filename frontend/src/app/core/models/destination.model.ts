export type DestinationType = 'seaport' | 'warehouse_land'

export interface Destination {
  id: number
  name: string
  location: string
  capacity: number
  type: DestinationType
}

export interface DestinationCreateRequest {
  name: string
  location: string
  capacity: number
  type: DestinationType
}

export interface DestinationUpdateRequest {
  name: string
  location: string
  capacity: number
  type: DestinationType
}

export interface DestinationFormData {
  name: string
  location: string
  capacity: number
  type: DestinationType
}

// Enum para los tipos de destino
export const DESTINATION_TYPES = {
  SEAPORT: 'seaport' as DestinationType,
  WAREHOUSE_LAND: 'warehouse_land' as DestinationType
} as const

// Labels para mostrar en UI
export const DESTINATION_TYPE_LABELS = {
  seaport: 'Puerto Marítimo',
  warehouse_land: 'Almacén Terrestre'
} as const
