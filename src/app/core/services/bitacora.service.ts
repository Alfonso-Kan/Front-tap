import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bitacora } from '../models/bitacora.model';

export interface BitacoraFiltros {
  coleccion?: string;
  accion?: string;
}

@Injectable({ providedIn: 'root' })
export class BitacoraService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bitacora`;

  list(filtros: BitacoraFiltros = {}): Observable<{ data: Bitacora[] }> {
    const params: Record<string, string> = {};

    if (filtros.coleccion) {
      params['coleccion'] = filtros.coleccion;
    }

    if (filtros.accion) {
      params['accion'] = filtros.accion;
    }

    return this.http.get<{ data: Bitacora[] }>(this.baseUrl, { params });
  }

  get(id: string): Observable<Bitacora> {
    return this.http.get<Bitacora>(`${this.baseUrl}/${id}`);
  }
}
