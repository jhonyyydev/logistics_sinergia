export interface Product {
  id?: number
  name: string
  description: string
  type: "maritime" | "terrestrial"
  date_creation: string
  created_at?: string
  updated_at?: string
}

export interface ProductRequest {
  name: string
  description: string
  type: "maritime" | "terrestrial"
  date_creation: string
}
