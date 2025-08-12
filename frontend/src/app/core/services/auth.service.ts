import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import { Router } from "@angular/router"
import { environment } from "../../../environments/environment"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor() {
    this.loadUserFromStorage()
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/user/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response)
      }),
    )
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/user/register`, userData)
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    this.router.navigate(["/auth/login"])
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    return user?.permissions.includes(permission) || false
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.roles.includes(role) || false
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem("token", authResponse.token)
    localStorage.setItem("user", JSON.stringify(authResponse.user))
    this.currentUserSubject.next(authResponse.user)
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      this.currentUserSubject.next(user)
    }
  }
}
