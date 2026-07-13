import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Perfil } from '../../../core/models/perfil.model';
import { Usuario } from '../../../core/models/usuario.model';
import { PerfilService } from '../../../core/services/perfil.service';

export interface UsuarioFormDialogData {
  usuario?: Usuario;
}

export interface UsuarioFormResult {
  nombre: string;
  usuario: string;
  telefono?: string;
  foto_perfil?: File;
  perfil_ids: string[];
}

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './usuario-form-dialog.component.html',
})
export class UsuarioFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UsuarioFormDialogComponent>);
  private readonly perfilService = inject(PerfilService);
  readonly data = inject<UsuarioFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.usuario;
  readonly perfiles = signal<Perfil[]>([]);
  readonly fotoSeleccionada = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(this.data.usuario?.foto_perfil ?? null);
  readonly errorFoto = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: [this.data.usuario?.nombre ?? '', [Validators.required, Validators.maxLength(255)]],
    usuario: [this.data.usuario?.usuario ?? '', [Validators.required, Validators.email]],
    telefono: [this.data.usuario?.telefono ?? ''],
    perfil_ids: [(this.data.usuario?.perfiles ?? []).map((perfil) => perfil.id)],
  });

  ngOnInit(): void {
    this.perfilService.list().subscribe((respuesta) => this.perfiles.set(respuesta.data));
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.fotoSeleccionada.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
    this.errorFoto.set(null);
  }

  guardar(): void {
    const fotoFaltante = !this.esEdicion && !this.fotoSeleccionada();

    if (this.form.invalid || fotoFaltante) {
      this.form.markAllAsTouched();

      if (fotoFaltante) {
        this.errorFoto.set('La foto de perfil es requerida.');
      }

      return;
    }

    const { nombre, usuario, telefono, perfil_ids } = this.form.getRawValue();
    const resultado: UsuarioFormResult = {
      nombre,
      usuario,
      telefono: telefono || undefined,
      perfil_ids,
      foto_perfil: this.fotoSeleccionada() ?? undefined,
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
