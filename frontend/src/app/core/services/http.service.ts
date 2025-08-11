import { inject, Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { AuthTokenService } from "./auth-token.service"

@Injectable({ providedIn: "root" })
export class HttpService {
  public readonly http = inject(HttpClient)
  private readonly tokenService = inject(AuthTokenService)
  private readonly apiUrl = "https://logistics-app-production-7e08.up.railway.app/api"

  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params })
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body)
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body)
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`)
  }
}
