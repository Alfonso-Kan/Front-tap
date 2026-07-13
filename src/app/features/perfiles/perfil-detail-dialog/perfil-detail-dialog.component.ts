import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Perfil } from '../../../core/models/perfil.model';

@Component({
  selector: 'app-perfil-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule],
  templateUrl: './perfil-detail-dialog.component.html',
})
export class PerfilDetailDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PerfilDetailDialogComponent>);
  readonly perfil = inject<Perfil>(MAT_DIALOG_DATA);
}
