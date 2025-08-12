import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import type { RegisterRequest } from "../../../core/models/user.model"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  registerForm: FormGroup
  isLoading = false
  errorMessage = ""
  successMessage = ""

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        address: ["", [Validators.required, Validators.minLength(5)]],
        phone: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
        type: ["national", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")
    const confirmPassword = form.get("confirmPassword")

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true })
    } else if (confirmPassword?.errors?.["passwordMismatch"]) {
      delete confirmPassword.errors["passwordMismatch"]
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null)
      }
    }
    return null
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true
      this.errorMessage = ""
      this.successMessage = ""

      const { confirmPassword, ...userData } = this.registerForm.value
      const registerData: RegisterRequest = userData

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false
          this.successMessage = "Registro exitoso. Puedes iniciar sesión ahora."
          setTimeout(() => {
            this.router.navigate(["/auth/login"])
          }, 2000)
        },
        error: (error) => {
          this.isLoading = false
          this.errorMessage = error.error?.message || "Error al registrarse. Intenta nuevamente."
        },
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} es requerido`
      if (field.errors["email"]) return "Email inválido"
      if (field.errors["minlength"])
        return `${fieldName} debe tener al menos ${field.errors["minlength"].requiredLength} caracteres`
      if (field.errors["pattern"]) return "Teléfono debe tener 10 dígitos"
      if (field.errors["passwordMismatch"]) return "Las contraseñas no coinciden"
    }
    return ""
  }
}
