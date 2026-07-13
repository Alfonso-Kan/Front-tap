import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Producto } from '../../../core/models/producto.model';

export interface ProductoFormDialogData {
  producto?: Producto;
}

@Component({
  selector: 'app-producto-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './producto-form-dialog.component.html',
})
export class ProductoFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProductoFormDialogComponent>);
  readonly data = inject<ProductoFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.producto;

  readonly form = this.fb.nonNullable.group({
    nombre: [this.data.producto?.nombre ?? '', [Validators.required, Validators.maxLength(255)]],
    marca: [this.data.producto?.marca ?? '', [Validators.required, Validators.maxLength(255)]],
    precio: [this.data.producto?.precio ?? 0, [Validators.required, Validators.min(0), Validators.max(999.99)]],
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
