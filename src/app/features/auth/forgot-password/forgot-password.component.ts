import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../../../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ThemeToggleComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly cargando = signal(false);
  readonly mensaje = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.mensaje.set(null);
    this.error.set(null);
    this.cargando.set(true);

    this.authService.forgotPassword(this.form.getRawValue().usuario).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.mensaje.set(respuesta.message);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err?.error?.errors?.usuario?.[0] ?? 'No se pudo procesar la solicitud.');
      },
    });
  }
}
