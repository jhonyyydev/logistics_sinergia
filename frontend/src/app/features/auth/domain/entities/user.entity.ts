export interface User {
  id?: string
  name: string
  email: string
  address: string
  phone: string
  type: UserType
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export type UserType = "national" | "international"
