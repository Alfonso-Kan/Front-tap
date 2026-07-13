import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Bitacora } from '../../../core/models/bitacora.model';

interface FilaDiff {
  campo: string;
  anterior: string;
  nuevo: string;
  cambio: boolean;
}

@Component({
  selector: 'app-bitacora-detail-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './bitacora-detail-dialog.component.html',
})
export class BitacoraDetailDialogComponent {
  readonly dialogRef = inject(MatDialogRef<BitacoraDetailDialogComponent>);
  readonly bitacora = inject<Bitacora>(MAT_DIALOG_DATA);

  readonly columnasDiff = ['campo', 'anterior', 'nuevo'];
  readonly filas = this.construirFilas();

  private construirFilas(): FilaDiff[] {
    const anterior = this.bitacora.datos_anteriores ?? {};
    const nuevo = this.bitacora.datos_nuevos ?? {};
    const campos = new Set([...Object.keys(anterior), ...Object.keys(nuevo)]);

    return Array.from(campos)
      .sort()
      .map((campo) => {
        const valorAnterior = this.formatear(anterior[campo]);
        const valorNuevo = this.formatear(nuevo[campo]);

        return { campo, anterior: valorAnterior, nuevo: valorNuevo, cambio: valorAnterior !== valorNuevo };
      });
  }

  private formatear(valor: unknown): string {
    if (valor === undefined) {
      return '—';
    }

    if (valor === null) {
      return 'null';
    }

    if (typeof valor === 'object') {
      return JSON.stringify(valor);
    }

    return String(valor);
  }
}
