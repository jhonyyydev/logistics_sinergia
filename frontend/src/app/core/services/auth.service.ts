// core/services/auth.service.ts
import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import { Router } from "@angular/router"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  // URL base del API
  private readonly API_URL = "https://logistics-app-production-7e08.up.railway.app/api"

  // Usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor() {
    this.loadUserFromStorage()
  }

  /**
   * Login del usuario
   */
  // core/services/auth.service.ts
  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/user/login`, credentials).pipe(
      tap(response => {
        this.setSession(response)
      })
    )
  }

  private setSession(authResponse: AuthResponse) {
    localStorage.setItem("token", authResponse.token)
    localStorage.setItem("user", JSON.stringify(authResponse.user))
    this.currentUserSubject.next(authResponse.user)
  }

   /**
   * Obtener token actual
   */
  getToken(): string | null {
    const token = localStorage.getItem("token")
    return token
  }


  /**
   * Registro de usuario
   */
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/user/register`, userData)
  }

  /**
   * Logout del usuario
   */
  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    this.router.navigate(["/auth/login"])
  }

  /**
   * Cargar usuario desde localStorage al inicializar la app
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        this.currentUserSubject.next(user)
      } catch (error) {
        this.clearStorage()
      }
    }
  }

  /**
   * Limpiar almacenamiento si hay errores
   */
  private clearStorage(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }
}
