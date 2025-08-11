import { inject, Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { HttpService } from "@/core/services/http.service"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  address: string
  phone: string
  type: "national" | "international"
  password: string
}

export interface RegisterResponse {
  message: string
  user: {
    id: string
    name: string
    email: string
    type: string
  }
}

@Injectable({ providedIn: "root" })
export class AuthHttpRepository {
  private readonly http = inject(HttpService)

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>("auth/user/login", data)
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>("auth/user/register", data)
  }
}
