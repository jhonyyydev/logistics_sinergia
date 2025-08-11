import { Component, inject } from "@angular/core"
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { HlmInput } from "@spartan-ng/helm/input"
import { HlmLabel } from "@spartan-ng/helm/label"
import { HlmButton } from "@spartan-ng/helm/button"
import { AuthHttpRepository } from "../../infrastructure/auth-http.repository"
import { AuthService } from "@/core/services/auth.service"

interface LoginRequest {
  email: string
  password: string
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput, HlmLabel, HlmButton],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder)
  private readonly authRepo = inject(AuthHttpRepository)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  private readonly VALIDATION_MESSAGES = {
    email: {
      required: "Email is required",
      email: "Enter a valid email address",
    },
    password: {
      required: "Password is required",
      minlength: "Password must be at least 6 characters",
    },
  } as const

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  })

  isLoading = false
  errorMessage = ""
  successMessage = ""

  submit(): void {
    if (this.form.valid) {
      this.performLogin()
    } else {
      this.handleInvalidForm()
    }
  }

  private performLogin(): void {
    this.resetMessages()
    this.setLoadingState(true)
    const loginData = this.prepareLoginData()

    this.authRepo.login(loginData).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (error) => this.handleLoginError(error),
    })
  }

  private prepareLoginData(): LoginRequest {
    return {
      email: this.form.value.email!,
      password: this.form.value.password!,
    }
  }

  private handleLoginSuccess(response: { token: string; permissions?: string[] }): void {
    this.setLoadingState(false)
    this.authService.login(response.token, response.permissions || [])
    this.showSuccessMessage()
    this.navigateToHome()
  }

  private handleLoginError(error: any): void {
    this.setLoadingState(false)
    this.errorMessage = error.error?.message || "Login failed. Please check your credentials."
  }

  private handleInvalidForm(): void {
    this.form.markAllAsTouched()
    this.errorMessage = "Please complete all fields correctly."
  }

  private resetMessages(): void {
    this.errorMessage = ""
    this.successMessage = ""
  }

  private setLoadingState(loading: boolean): void {
    this.isLoading = loading
  }

  private showSuccessMessage(): void {
    this.successMessage = "Login successful! Redirecting..."
  }

  private navigateToHome(): void {
    this.router.navigateByUrl("/dashboard")
  }

  getFieldError(fieldName: keyof typeof this.VALIDATION_MESSAGES): string {
    const field = this.form.get(fieldName)
    if (field?.touched && field?.errors) {
      const fieldMessages = this.VALIDATION_MESSAGES[fieldName]
      const firstError = Object.keys(field.errors)[0]
      return fieldMessages[firstError as keyof typeof fieldMessages] || "Invalid input"
    }
    return ""
  }
}
