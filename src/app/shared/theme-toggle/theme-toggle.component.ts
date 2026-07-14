import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      type="button"
      (click)="themeService.alternar()"
      [matTooltip]="themeService.tema() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      aria-label="Cambiar tema claro/oscuro"
    >
      <mat-icon>{{ themeService.tema() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
