import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly menuItems = computed(() => MENU_ITEMS.filter((item) => this.authService.hasSeccion(item.codigo)));

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
