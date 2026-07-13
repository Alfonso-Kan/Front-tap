import { Component } from '@angular/core';

@Component({
  selector: 'app-sin-acceso',
  standalone: true,
  template: `
    <div class="sin-acceso">
      <h2>Acceso no autorizado</h2>
      <p>No tienes permisos para ver esta sección. Contacta a un administrador si crees que esto es un error.</p>
    </div>
  `,
  styles: [
    `
      .sin-acceso {
        padding: 24px;
      }
    `,
  ],
})
export class SinAccesoComponent {}
