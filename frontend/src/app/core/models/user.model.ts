export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  address: string
  phone: string
  type: "national" | "international"
  password: string
}
