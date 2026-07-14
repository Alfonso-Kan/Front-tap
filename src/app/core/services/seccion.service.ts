import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Seccion } from '../models/seccion.model';

export interface SeccionPayload {
  nombre: string;
}

/**
 * Las secciones son las 5 pantallas fijas del sistema (ligadas a rutas y
 * middleware de acceso reales), por eso no hay create/remove: solo listar,
 * ver detalle y renombrar.
 */
@Injectable({ providedIn: 'root' })
export class SeccionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/secciones`;

  list(): Observable<{ data: Seccion[] }> {
    return this.http.get<{ data: Seccion[] }>(this.baseUrl);
  }

  get(id: string): Observable<Seccion> {
    return this.http.get<Seccion>(`${this.baseUrl}/${id}`);
  }

  update(id: string, payload: SeccionPayload): Observable<Seccion> {
    return this.http.put<Seccion>(`${this.baseUrl}/${id}`, payload);
  }
}
