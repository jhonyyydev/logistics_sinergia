export interface Destination {
  id?: number
  name: string
  location: string
  capacity: number
  destination_type: "warehouse_land" | "seaport"
  created_at?: string
  updated_at?: string
}

export interface DestinationRequest {
  name: string
  location: string
  capacity: number
  destination_type: "warehouse_land" | "seaport"
}
