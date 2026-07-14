import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

interface MenuItem {
  codigo: string;
  label: string;
  route: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { codigo: 'productos', label: 'Productos', route: '/productos', icon: 'inventory_2' },
  { codigo: 'usuarios', label: 'Usuarios', route: '/usuarios', icon: 'people' },
  { codigo: 'perfiles', label: 'Perfiles', route: '/perfiles', icon: 'badge' },
  { codigo: 'secciones', label: 'Secciones', route: '/secciones', icon: 'view_list' },
  { codigo: 'bitacora', label: 'Bitácora', route: '/bitacora', icon: 'history' },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ThemeToggleComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  // El menu muestra siempre las 5 secciones, sin importar el perfil; la
  // restriccion real de acceso la sigue aplicando seccionGuard en las rutas
  // (redirige a /sin-acceso), no el filtrado del menu.
  readonly menuItems = MENU_ITEMS;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
