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
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  /**
   * Obtener rol principal del usuario
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser()
    return user?.roles?.[0] || null
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.roles?.includes('admin') || false
  }

  /**
   * Verificar si el usuario es cliente
   */
  isClient(): boolean {
    const user = this.getCurrentUser()
    return user?.roles?.includes('client') || false
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    return user?.permissions?.includes(permission) || false
  }

  /**
   * Verificar si el usuario tiene alguno de los permisos dados
   */
  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getCurrentUser()
    if (!user?.permissions) return false
    return permissions.some(permission => user.permissions.includes(permission))
  }

  /**
   * Verificar si el usuario tiene todos los permisos dados
   */
  hasAllPermissions(permissions: string[]): boolean {
    const user = this.getCurrentUser()
    if (!user?.permissions) return false
    return permissions.every(permission => user.permissions.includes(permission))
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.roles?.includes(role) || false
  }

  /**
   * Verificar si el usuario tiene alguno de los roles dados
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser()
    if (!user?.roles) return false
    return roles.some(role => user.roles.includes(role))
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

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser()
  }

  /**
   * Obtener la ruta de inicio según el rol
   */
  getHomeRoute(): string {
    const role = this.getUserRole()

    switch(role) {
      case 'admin':
        return '/panel/dashboard'
      case 'client':
        return '/client/dashboard'
      default:
        return '/dashboard'
    }
  }
}
