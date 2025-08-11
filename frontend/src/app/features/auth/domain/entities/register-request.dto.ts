export interface RegisterRequestDto {
  name: string
  email: string
  address: string
  phone: string
  type: "national" | "international"
  password: string
}
