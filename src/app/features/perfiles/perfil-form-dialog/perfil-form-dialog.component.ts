import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Perfil } from '../../../core/models/perfil.model';
import { Seccion } from '../../../core/models/seccion.model';
import { SeccionService } from '../../../core/services/seccion.service';

export interface PerfilFormDialogData {
  perfil?: Perfil;
}

@Component({
  selector: 'app-perfil-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './perfil-form-dialog.component.html',
})
export class PerfilFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PerfilFormDialogComponent>);
  private readonly seccionService = inject(SeccionService);
  readonly data = inject<PerfilFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.perfil;
  readonly secciones = signal<Seccion[]>([]);

  readonly form = this.fb.nonNullable.group({
    nombre: [this.data.perfil?.nombre ?? '', [Validators.required, Validators.maxLength(255)]],
    seccion_ids: [
      (this.data.perfil?.secciones ?? []).map((seccion) => seccion.id),
      [Validators.required, Validators.minLength(1)],
    ],
  });

  ngOnInit(): void {
    this.seccionService.list().subscribe((respuesta) => this.secciones.set(respuesta.data));
  }

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
