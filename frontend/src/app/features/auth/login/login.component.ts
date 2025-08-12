import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import type { LoginRequest } from "../../../core/models/user.model"

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

  /**
   * Manejar envío del formulario
   */
  async onSubmit(): Promise<void> {
    this.errorMessage = ""
    if (this.loginForm.invalid) {
      this.markFormGroupTouched()
      return
    }

    this.isLoading = true

    const credentials: LoginRequest = this.loginForm.value

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false
        this.router.navigate(['/dashboard']) // ajusta ruta destino tras login
      },
      error: (error) => {
        this.isLoading = false
        this.handleError(error)
      }
    })
  }


  /**
   * Manejar errores de login
   */
  private handleError(error: any): void {
    if (error.status === 0) {
      this.errorMessage = "Error de conexión. Verifica tu internet."
    } else if (error.status === 401) {
      this.errorMessage = "Credenciales incorrectas."
    } else if (error.status === 422) {
      this.errorMessage = "Datos inválidos."
    } else {
      this.errorMessage = "Error al iniciar sesión. Intenta nuevamente."
    }
  }

  /**
   * Marcar todos los campos como tocados
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  /**
   * Obtener error de un campo específico
   */
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
