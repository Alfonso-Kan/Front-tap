import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-detail-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './usuario-detail-dialog.component.html',
})
export class UsuarioDetailDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UsuarioDetailDialogComponent>);
  readonly usuario = inject<Usuario>(MAT_DIALOG_DATA);
}
