import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'tap_demo_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  readonly currentUser = signal<AuthUser | null>(null);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  hasSeccion(codigo: string): boolean {
    return !!this.currentUser()?.secciones.some((seccion) => seccion.codigo === codigo);
  }

  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { usuario, password }).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        this.currentUser.set(response.user);
      }),
    );
  }

  register(datos: {
    nombre: string;
    usuario: string;
    password: string;
    password_confirmation: string;
    telefono?: string | null;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/register`, datos).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        this.currentUser.set(response.user);
      }),
    );
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}/me`).pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): void {
    if (this.isLoggedIn()) {
      this.http.post(`${this.baseUrl}/logout`, {}).subscribe({ error: () => undefined });
    }

    this.clearSession();
  }

  forgotPassword(usuario: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, { usuario });
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }
}
