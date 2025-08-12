export interface Transport {
  id?: number
  identifier: string
  unit_type: "fleet" | "vehicle"
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface TransportRequest {
  identifier: string
  unit_type: "fleet" | "vehicle"
  active: boolean
}
