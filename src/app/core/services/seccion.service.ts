import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Seccion } from '../models/seccion.model';

export interface SeccionPayload {
  codigo: string;
  nombre: string;
}

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

  create(payload: SeccionPayload): Observable<Seccion> {
    return this.http.post<Seccion>(this.baseUrl, payload);
  }

  update(id: string, payload: SeccionPayload): Observable<Seccion> {
    return this.http.put<Seccion>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
