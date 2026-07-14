import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Seccion } from '../../../core/models/seccion.model';

export interface SeccionFormDialogData {
  seccion: Seccion;
}

@Component({
  selector: 'app-seccion-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './seccion-form-dialog.component.html',
})
export class SeccionFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SeccionFormDialogComponent>);
  readonly data = inject<SeccionFormDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: [this.data.seccion.nombre, [Validators.required, Validators.maxLength(255)]],
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
