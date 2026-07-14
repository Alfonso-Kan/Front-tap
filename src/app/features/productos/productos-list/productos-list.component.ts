import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Producto } from '../../../core/models/producto.model';
import { ProductoPayload, ProductoService } from '../../../core/services/producto.service';
import { descargarBlob } from '../../../core/utils/download.util';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ProductoFormDialogComponent } from '../producto-form-dialog/producto-form-dialog.component';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './productos-list.component.html',
})
export class ProductosListComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['codigo', 'nombre', 'precio', 'fecha_creacion', 'acciones'];
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(false);
  readonly exportandoPdf = signal(false);
  readonly exportandoExcel = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.productoService.list().subscribe({
      next: (respuesta) => {
        this.productos.set(respuesta.data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.snackBar.open('No se pudo cargar el listado de productos.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  abrirCrear(): void {
    this.dialog
      .open(ProductoFormDialogComponent, { width: '480px', data: {} })
      .afterClosed()
      .subscribe((payload: ProductoPayload | undefined) => {
        if (!payload) {
          return;
        }

        this.productoService.create(payload).subscribe({
          next: () => {
            this.snackBar.open('Producto creado.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo crear el producto.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  abrirEditar(producto: Producto): void {
    this.dialog
      .open(ProductoFormDialogComponent, { width: '480px', data: { producto } })
      .afterClosed()
      .subscribe((payload: ProductoPayload | undefined) => {
        if (!payload) {
          return;
        }

        this.productoService.update(producto.id, payload).subscribe({
          next: () => {
            this.snackBar.open('Producto actualizado.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo actualizar el producto.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  eliminar(producto: Producto): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: { titulo: 'Eliminar producto', mensaje: `¿Seguro que deseas eliminar "${producto.nombre}"?` },
      })
      .afterClosed()
      .subscribe((confirmado: boolean | undefined) => {
        if (!confirmado) {
          return;
        }

        this.productoService.remove(producto.id).subscribe({
          next: () => {
            this.snackBar.open('Producto eliminado.', 'Cerrar', { duration: 3000 });
            this.cargar();
          },
          error: () => this.snackBar.open('No se pudo eliminar el producto.', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  exportarPdf(): void {
    this.exportandoPdf.set(true);
    this.productoService.exportPdf().subscribe({
      next: (blob) => {
        descargarBlob(blob, 'productos.pdf');
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
    this.productoService.exportExcel().subscribe({
      next: (blob) => {
        descargarBlob(blob, 'productos.xlsx');
        this.exportandoExcel.set(false);
      },
      error: () => {
        this.exportandoExcel.set(false);
        this.snackBar.open('No se pudo generar el Excel.', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
