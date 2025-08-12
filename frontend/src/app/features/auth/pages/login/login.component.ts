import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AuthService } from "../../../../core/services/auth.service"
import type { LoginRequest } from "../../../../core/models/user.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  loginForm: FormGroup
  isLoading = false
  errorMessage = ""

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true
      this.errorMessage = ""

      const credentials: LoginRequest = this.loginForm.value

      try {
        console.log('Attempting login...')
        const response = await this.authService.login(credentials).toPromise()

        if (response) {
          console.log('Login successful, waiting for user to be set...')

          // Esperar un poco para asegurar que el BehaviorSubject se actualice
          await new Promise(resolve => setTimeout(resolve, 100))

          // Verificar que el usuario esté correctamente cargado
          const user = this.authService.getCurrentUser()
          console.log('Current user after login:', user)

          if (user) {
            console.log('Navigating to dashboard...')
            await this.router.navigate(["/"])
          } else {
            throw new Error('Usuario no cargado correctamente')
          }
        }
      } catch (error: any) {
        console.error('Login error:', error)

        // Mejorar el manejo de errores de conexión
        if (error.status === 0) {
          this.errorMessage = "Error de conexión. Verifica tu conexión a internet e intenta nuevamente."
        } else {
          this.errorMessage = error.error?.message || "Error al iniciar sesión. Intenta nuevamente."
        }
      } finally {
        this.isLoading = false
      }
    } else {
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} es requerido`
      if (field.errors["email"]) return "Email inválido"
      if (field.errors["minlength"]) return `${fieldName} debe tener al menos 6 caracteres`
    }
    return ""
  }
}
