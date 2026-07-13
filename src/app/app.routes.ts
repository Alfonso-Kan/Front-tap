import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { seccionGuard } from './core/guards/seccion.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'productos' },
      {
        path: 'sin-acceso',
        loadComponent: () => import('./layout/sin-acceso/sin-acceso.component').then((m) => m.SinAccesoComponent),
      },
      {
        path: 'productos',
        canActivate: [seccionGuard],
        data: { seccion: 'productos' },
        loadComponent: () =>
          import('./features/productos/productos-list/productos-list.component').then(
            (m) => m.ProductosListComponent,
          ),
      },
      {
        path: 'usuarios',
        canActivate: [seccionGuard],
        data: { seccion: 'usuarios' },
        loadComponent: () =>
          import('./features/usuarios/usuarios-list/usuarios-list.component').then((m) => m.UsuariosListComponent),
      },
      {
        path: 'perfiles',
        canActivate: [seccionGuard],
        data: { seccion: 'perfiles' },
        loadComponent: () =>
          import('./features/perfiles/perfiles-list/perfiles-list.component').then((m) => m.PerfilesListComponent),
      },
      {
        path: 'secciones',
        canActivate: [seccionGuard],
        data: { seccion: 'secciones' },
        loadComponent: () =>
          import('./features/secciones/secciones-list/secciones-list.component').then(
            (m) => m.SeccionesListComponent,
          ),
      },
      {
        path: 'bitacora',
        canActivate: [seccionGuard],
        data: { seccion: 'bitacora' },
        loadComponent: () =>
          import('./features/bitacora/bitacora-list/bitacora-list.component').then((m) => m.BitacoraListComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
