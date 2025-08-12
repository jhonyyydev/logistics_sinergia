export type TransportUnitType = 'fleet' | 'vehicle'

export interface Transport {
  id: number
  identifier: string
  type: TransportUnitType
  active: boolean
}

export interface TransportCreateRequest {
  identifier: string
  type: TransportUnitType
  active: boolean
}

export interface TransportUpdateRequest {
  identifier: string
  type: TransportUnitType
  active: boolean
}

export interface TransportFormData {
  identifier: string
  type: TransportUnitType
  active: boolean
}

// Enum para los tipos de unidad de transporte
export const TRANSPORT_UNIT_TYPES = {
  FLEET: 'fleet' as TransportUnitType,
  VEHICLE: 'vehicle' as TransportUnitType
} as const

// Labels para mostrar en UI
export const TRANSPORT_UNIT_TYPE_LABELS = {
  fleet: 'Flota',
  vehicle: 'Vehículo'
} as const

// Formatos de validación
export const TRANSPORT_FORMATS = {
  VEHICLE: /^[A-Z]{3}\d{3}$/, // 3 letras + 3 números (ej: ABC123)
  FLEET: /^[A-Z]{3}\d{4}[A-Z]$/ // 3 letras + 4 números + 1 letra (ej: ABC1234Z)
} as const

// Mensajes de ayuda para formatos
export const TRANSPORT_FORMAT_HELP = {
  vehicle: 'Formato: 3 letras y 3 números (ej: ABC123)',
  fleet: 'Formato: 3 letras, 4 números y 1 letra (ej: ABC1234Z)'
} as const
