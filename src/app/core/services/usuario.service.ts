import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

export interface UsuarioPayload {
  nombre: string;
  usuario: string;
  telefono?: string;
  foto_perfil?: File;
  perfil_ids?: string[];
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  list(buscar?: string): Observable<{ data: Usuario[] }> {
    return this.http.get<{ data: Usuario[] }>(this.baseUrl, { params: buscar ? { buscar } : {} });
  }

  get(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  create(payload: UsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, this.toFormData(payload));
  }

  update(id: string, payload: UsuarioPayload): Observable<Usuario> {
    const formData = this.toFormData(payload);
    formData.append('_method', 'PUT');

    return this.http.post<Usuario>(`${this.baseUrl}/${id}`, formData);
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

  private toFormData(payload: UsuarioPayload): FormData {
    const formData = new FormData();
    formData.append('nombre', payload.nombre);
    formData.append('usuario', payload.usuario);

    if (payload.telefono) {
      formData.append('telefono', payload.telefono);
    }

    if (payload.foto_perfil) {
      formData.append('foto_perfil', payload.foto_perfil);
    }

    (payload.perfil_ids ?? []).forEach((id) => formData.append('perfil_ids[]', id));

    return formData;
  }
}
