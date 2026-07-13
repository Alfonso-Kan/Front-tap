import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Perfil } from '../models/perfil.model';

export interface PerfilPayload {
  nombre: string;
  seccion_ids: string[];
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/perfiles`;

  list(buscar?: string): Observable<{ data: Perfil[] }> {
    return this.http.get<{ data: Perfil[] }>(this.baseUrl, { params: buscar ? { buscar } : {} });
  }

  get(id: string): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.baseUrl}/${id}`);
  }

  create(payload: PerfilPayload): Observable<Perfil> {
    return this.http.post<Perfil>(this.baseUrl, payload);
  }

  update(id: string, payload: PerfilPayload): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/pdf`, { responseType: 'blob' });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/excel`, { responseType: 'blob' });
  }
}
