import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Bitacora } from '../../../core/models/bitacora.model';
import { BitacoraService } from '../../../core/services/bitacora.service';
import { BitacoraDetailDialogComponent } from '../bitacora-detail-dialog/bitacora-detail-dialog.component';

@Component({
  selector: 'app-bitacora-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './bitacora-list.component.html',
})
export class BitacoraListComponent implements OnInit {
  private readonly bitacoraService = inject(BitacoraService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['fecha', 'coleccion', 'accion', 'usuario', 'acciones'];
  readonly registros = signal<Bitacora[]>([]);
  readonly cargando = signal(false);

  coleccion = '';
  accion = '';

  readonly colecciones = [
    { valor: '', etiqueta: 'Todas' },
    { valor: 'productos', etiqueta: 'Productos' },
    { valor: 'users', etiqueta: 'Usuarios' },
    { valor: 'perfiles', etiqueta: 'Perfiles' },
    { valor: 'secciones', etiqueta: 'Secciones' },
  ];

  readonly acciones = [
    { valor: '', etiqueta: 'Todas' },
    { valor: 'creacion', etiqueta: 'Creación' },
    { valor: 'actualizacion', etiqueta: 'Actualización' },
    { valor: 'eliminacion', etiqueta: 'Eliminación' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.bitacoraService
      .list({ coleccion: this.coleccion || undefined, accion: this.accion || undefined })
      .subscribe({
        next: (respuesta) => {
          this.registros.set(respuesta.data);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
          this.snackBar.open('No se pudo cargar la bitácora.', 'Cerrar', { duration: 4000 });
        },
      });
  }

  verDiff(registro: Bitacora): void {
    this.dialog.open(BitacoraDetailDialogComponent, { width: '600px', data: registro });
  }
}
