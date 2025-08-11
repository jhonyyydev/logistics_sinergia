// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmInput,
    HlmLabel,
    BrnSelectImports,
    HlmSelectImports,
    HlmButton
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form;

  roles = [
    { value: 'client', label: 'Cliente' },
    { value: 'admin', label: 'Administrador' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
