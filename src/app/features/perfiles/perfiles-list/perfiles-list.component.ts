import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Perfil } from '../../../core/models/perfil.model';
import { PerfilPayload, PerfilService } from '../../../core/services/perfil.service';
import { descargarBlob } from '../../../core/utils/download.util';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { PerfilDetailDialogComponent } from '../perfil-detail-dialog/perfil-detail-dialog.component';
import { PerfilFormDialogComponent } from '../perfil-form-dialog/perfil-form-dialog.component';

@Component({
  selector: 'app-perfiles-list',
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
  templateUrl: './perfiles-list.component.html',
})
export class PerfilesListComponent implements OnInit {
  private readonly perfilService = inject(PerfilService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['codigo', 'nombre', 'fecha_creacion', 'acciones'];
  readonly perfiles = signal<Perfil[]>([]);
  readonly cargando = signal(false);
  readonly exportandoPdf = signal(false);
  readonly exportandoExcel = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.perfilService.list().subscribe({
      next: (respuesta) => {
        this.perfiles.set(respuesta.data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.snackBar.open('No se pudo cargar el listado de perfiles.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  abrirCrear(): void {
    this.dialog
      .open(PerfilFormDialogComponent, { width: '480px', data: {} })
      .afterClosed()
      .subscribe((payload: PerfilPayload | undefined) => {
        if (!payload) {
          return;
        }

        this.perfilService.create(payload).subscribe({
          next: () => {
            this.snackBar.open('Perfil creado.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo crear el perfil.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  abrirEditar(perfil: Perfil): void {
    this.perfilService.get(perfil.id).subscribe((detalle) => {
      this.dialog
        .open(PerfilFormDialogComponent, { width: '480px', data: { perfil: detalle } })
        .afterClosed()
        .subscribe((payload: PerfilPayload | undefined) => {
          if (!payload) {
            return;
          }

          this.perfilService.update(perfil.id, payload).subscribe({
            next: () => {
              this.snackBar.open('Perfil actualizado.', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('No se pudo actualizar el perfil.', 'Cerrar', { duration: 4000 }),
          });
        });
    });
  }

  verDetalle(perfil: Perfil): void {
    this.perfilService.get(perfil.id).subscribe((detalle) => {
      this.dialog.open(PerfilDetailDialogComponent, { width: '420px', data: detalle });
    });
  }

  eliminar(perfil: Perfil): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: { titulo: 'Eliminar perfil', mensaje: `¿Seguro que deseas eliminar "${perfil.nombre}"?` },
      })
      .afterClosed()
      .subscribe((confirmado: boolean | undefined) => {
        if (!confirmado) {
          return;
        }

        this.perfilService.remove(perfil.id).subscribe({
          next: () => {
            this.snackBar.open('Perfil eliminado.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo eliminar el perfil.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  exportarPdf(): void {
    this.exportandoPdf.set(true);
    this.perfilService.exportPdf().subscribe({
      next: (blob) => {
        descargarBlob(blob, 'perfiles.pdf');
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
    this.perfilService.exportExcel().subscribe({
      next: (blob) => {
        descargarBlob(blob, 'perfiles.xlsx');
        this.exportandoExcel.set(false);
      },
      error: () => {
        this.exportandoExcel.set(false);
        this.snackBar.open('No se pudo generar el Excel.', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
