import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { descargarBlob } from '../../../core/utils/download.util';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { UsuarioDetailDialogComponent } from '../usuario-detail-dialog/usuario-detail-dialog.component';
import { UsuarioFormDialogComponent, UsuarioFormResult } from '../usuario-form-dialog/usuario-form-dialog.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './usuarios-list.component.html',
})
export class UsuariosListComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['codigo', 'usuario', 'nombre', 'fecha_creacion', 'acciones'];
  readonly usuarios = signal<Usuario[]>([]);
  readonly cargando = signal(false);
  readonly exportandoPdf = signal(false);
  readonly exportandoExcel = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.usuarioService.list().subscribe({
      next: (respuesta) => {
        this.usuarios.set(respuesta.data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.snackBar.open('No se pudo cargar el listado de usuarios.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  abrirCrear(): void {
    this.dialog
      .open(UsuarioFormDialogComponent, { width: '520px', data: {} })
      .afterClosed()
      .subscribe((resultado: UsuarioFormResult | undefined) => {
        if (!resultado) {
          return;
        }

        this.usuarioService.create(resultado).subscribe({
          next: () => {
            this.snackBar.open('Usuario creado. Se enviaron las credenciales por correo.', 'Cerrar', {
              duration: 4000,
            });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo crear el usuario.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  abrirEditar(usuario: Usuario): void {
    this.usuarioService.get(usuario.id).subscribe((detalle) => {
      this.dialog
        .open(UsuarioFormDialogComponent, { width: '520px', data: { usuario: detalle } })
        .afterClosed()
        .subscribe((resultado: UsuarioFormResult | undefined) => {
          if (!resultado) {
            return;
          }

          this.usuarioService.update(usuario.id, resultado).subscribe({
            next: () => {
              this.snackBar.open('Usuario actualizado.', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('No se pudo actualizar el usuario.', 'Cerrar', { duration: 4000 }),
          });
        });
    });
  }

  verDetalle(usuario: Usuario): void {
    this.usuarioService.get(usuario.id).subscribe((detalle) => {
      this.dialog.open(UsuarioDetailDialogComponent, { width: '420px', data: detalle });
    });
  }

  eliminar(usuario: Usuario): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: { titulo: 'Eliminar usuario', mensaje: `¿Seguro que deseas eliminar a "${usuario.nombre}"?` },
      })
      .afterClosed()
      .subscribe((confirmado: boolean | undefined) => {
        if (!confirmado) {
          return;
        }

        this.usuarioService.remove(usuario.id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo eliminar el usuario.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  exportarPdf(): void {
    this.exportandoPdf.set(true);
    this.usuarioService.exportPdf().subscribe({
      next: (blob) => {
        descargarBlob(blob, 'usuarios.pdf');
        this.exportandoPdf.set(false);
      },
      error: () => {
        this.exportandoPdf.set(false);
        this.snackBar.open('No se pudo generar el PDF.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  exportarExcel(): void {
    this.exportandoExcel.set(true);
    this.usuarioService.exportExcel().subscribe({
      next: (blob) => {
        descargarBlob(blob, 'usuarios.xlsx');
        this.exportandoExcel.set(false);
      },
      error: () => {
        this.exportandoExcel.set(false);
        this.snackBar.open('No se pudo generar el Excel.', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
