export interface Client {
  id?: number
  name: string
  email: string
  address: string
  phone: string
  type: "national" | "international"
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface ClientRequest {
  name: string
  email: string
  address: string
  phone: string
  type: "national" | "international"
  active: boolean
}
