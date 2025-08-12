export type ClientType = 'national' | 'international'

export interface Client {
  id: number
  full_name: string
  email: string
  address: string
  phone: string
  type: ClientType
  active: boolean
}

export interface ClientCreateRequest {
  full_name: string
  email: string
  address: string
  phone: string
  type: ClientType
  active: boolean
}

export interface ClientUpdateRequest {
  full_name: string
  email: string
  address: string
  phone: string
  type: ClientType
  active: boolean
}

export interface ClientFormData {
  full_name: string
  email: string
  address: string
  phone: string
  type: ClientType
  active: boolean
}

// Enum para los tipos de cliente
export const CLIENT_TYPES = {
  NATIONAL: 'national' as ClientType,
  INTERNATIONAL: 'international' as ClientType
} as const

// Labels para mostrar en UI
export const CLIENT_TYPE_LABELS = {
  national: 'Nacional',
  international: 'Internacional'
} as const

// Validaciones y formatos
export const CLIENT_VALIDATIONS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
  FULL_NAME: /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+([\s][a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/
} as const

// Mensajes de ayuda para validaciones
export const CLIENT_VALIDATION_MESSAGES = {
  email: 'Ingresa un email válido (ej: usuario@ejemplo.com)',
  phone: 'Ingresa un teléfono válido (ej: 3001234567)',
  full_name: 'El nombre solo debe contener letras y espacios',
  address: 'La dirección es requerida',
  type: 'Selecciona el tipo de cliente'
} as const

// Longitudes máximas
export const CLIENT_MAX_LENGTHS = {
  FULL_NAME: 100,
  EMAIL: 100,
  ADDRESS: 200,
  PHONE: 20
} as const
