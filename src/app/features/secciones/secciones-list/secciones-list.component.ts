import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Seccion } from '../../../core/models/seccion.model';
import { SeccionPayload, SeccionService } from '../../../core/services/seccion.service';
import { SeccionFormDialogComponent } from '../seccion-form-dialog/seccion-form-dialog.component';

@Component({
  selector: 'app-secciones-list',
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
  templateUrl: './secciones-list.component.html',
})
export class SeccionesListComponent implements OnInit {
  private readonly seccionService = inject(SeccionService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['codigo', 'nombre', 'fecha_creacion', 'acciones'];
  readonly secciones = signal<Seccion[]>([]);
  readonly cargando = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.seccionService.list().subscribe({
      next: (respuesta) => {
        this.secciones.set(respuesta.data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.snackBar.open('No se pudo cargar el listado de secciones.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  abrirEditar(seccion: Seccion): void {
    this.dialog
      .open(SeccionFormDialogComponent, { width: '420px', data: { seccion } })
      .afterClosed()
      .subscribe((payload: SeccionPayload | undefined) => {
        if (!payload) {
          return;
        }

        this.seccionService.update(seccion.id, payload).subscribe({
          next: () => {
            this.snackBar.open('Sección actualizada.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo actualizar la sección.', 'Cerrar', { duration: 4000 }),
        });
      });
  }
}
