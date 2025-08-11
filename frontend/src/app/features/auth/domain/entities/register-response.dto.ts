export interface RegisterResponseDto {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
    type: string
  }
  token?: string
}
