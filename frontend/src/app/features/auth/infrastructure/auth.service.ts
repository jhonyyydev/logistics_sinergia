import { Injectable, inject } from "@angular/core"
import type { Observable } from "rxjs"
import { HttpService } from "../../../core/services/http.service"
import { AuthDomainService } from "../domain/services/auth-domain.service"
import type { RegisterRequestDto } from "../domain/entities/register-request.dto"
import type { RegisterResponseDto } from "../domain/entities/register-response.dto"

@Injectable({
  providedIn: "root",
})
export class AuthService extends AuthDomainService {
  private readonly httpService = inject(HttpService)

  private readonly authApiUrl = "https://logistics-app-production-7e08.up.railway.app/api"

  register(request: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.httpService.post<RegisterResponseDto>(
      `${this.authApiUrl}/auth/user/register`.replace("http://localhost:8000/api/", ""),
      request,
    )
  }

  registerDirect(request: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.httpService.http.post<RegisterResponseDto>(`${this.authApiUrl}/auth/user/register`, request)
  }
}
