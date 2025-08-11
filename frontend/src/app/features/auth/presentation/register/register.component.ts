import { Component, inject } from "@angular/core"
import { FormBuilder, Validators, ReactiveFormsModule, type FormGroup } from "@angular/forms"
import { Router } from "@angular/router"
import { HlmInput } from "@spartan-ng/helm/input"
import { HlmLabel } from "@spartan-ng/helm/label"
import { BrnSelectImports } from "@spartan-ng/brain/select"
import { HlmSelectImports } from "@spartan-ng/helm/select"
import { HlmButton } from "@spartan-ng/helm/button"
import { CommonModule } from "@angular/common"
import { AuthHttpRepository, type RegisterRequest } from "../../infrastructure/auth-http.repository"
import { ToastService } from "../../../../shared/services/toast.service"

const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MIN_ADDRESS_LENGTH: 5,
  MIN_PASSWORD_LENGTH: 6,
  PHONE_PATTERN: /^\d{10}$/,
  REDIRECT_DELAY: 2000,
} as const

const ERROR_MESSAGES = {
  required: (field: string) => `${field} is required`,
  email: () => "Enter a valid email",
  minlength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  pattern: () => "Invalid format",
  generic: () => "Registration failed. Please try again.",
  validation: () => "Please complete all fields correctly.",
} as const

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput, HlmLabel, BrnSelectImports, HlmSelectImports, HlmButton],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder)
  private readonly authRepo = inject(AuthHttpRepository)
  private readonly router = inject(Router)
  private readonly toastService = inject(ToastService)

  form = this.createForm()

  userTypes = [
    { value: "national" as const, label: "National" },
    { value: "international" as const, label: "International" },
  ]

  isLoading = false
  errorMessage = ""

  private createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required, Validators.minLength(VALIDATION_CONSTANTS.MIN_NAME_LENGTH)]],
      email: ["", [Validators.required, Validators.email]],
      address: ["", [Validators.required, Validators.minLength(VALIDATION_CONSTANTS.MIN_ADDRESS_LENGTH)]],
      phone: ["", [Validators.required, Validators.pattern(VALIDATION_CONSTANTS.PHONE_PATTERN)]],
      type: ["national" as "national" | "international", Validators.required],
      password: ["", [Validators.required, Validators.minLength(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH)]],
    })
  }

  submit(): void {
    if (this.isFormValid()) {
      this.processRegistration()
    } else {
      this.handleInvalidForm()
    }
  }

  private isFormValid(): boolean {
    return this.form.valid
  }

  private handleInvalidForm(): void {
    this.form.markAllAsTouched()
    this.errorMessage = ERROR_MESSAGES.validation()
  }

  private processRegistration(): void {
    this.setLoadingState(true)
    this.clearErrorMessage()

    const registerData = this.prepareFormData()

    this.authRepo.register(registerData).subscribe({
      next: (response) => this.handleRegistrationSuccess(response),
      error: (error) => this.handleRegistrationError(error),
    })
  }

  private prepareFormData(): RegisterRequest {
    const formValue = this.form.value
    return {
      name: formValue.name!,
      email: formValue.email!,
      address: formValue.address!,
      phone: formValue.phone!,
      type: formValue.type!,
      password: formValue.password!,
    }
  }

  private handleRegistrationSuccess(response: any): void {
    console.log("User registered successfully:", response)
    this.setLoadingState(false)
    this.toastService.success(
      "Registration successful",
      "Your account has been created successfully. You will be redirected to login.",
    )
    this.redirectToLogin()
  }

  private handleRegistrationError(error: any): void {
    console.error("Registration error:", error)
    this.setLoadingState(false)
    this.errorMessage = error.error?.message || ERROR_MESSAGES.generic()
  }

  private setLoadingState(loading: boolean): void {
    this.isLoading = loading
  }

  private clearErrorMessage(): void {
    this.errorMessage = ""
  }

  private redirectToLogin(): void {
    setTimeout(() => {
      this.router.navigate(["/auth/login"])
    }, VALIDATION_CONSTANTS.REDIRECT_DELAY)
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName)

    if (!field?.touched || !field?.errors) {
      return ""
    }

    const errors = field.errors

    if (errors["required"]) {
      return ERROR_MESSAGES.required(fieldName)
    }

    if (errors["email"]) {
      return ERROR_MESSAGES.email()
    }

    if (errors["minlength"]) {
      return ERROR_MESSAGES.minlength(fieldName, errors["minlength"].requiredLength)
    }

    if (errors["pattern"]) {
      return ERROR_MESSAGES.pattern()
    }

    return ""
  }
}
