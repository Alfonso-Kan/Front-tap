import { Seccion } from './seccion.model';
import { PerfilResumen } from './usuario.model';

export interface AuthUser {
  id: string;
  codigo: string;
  nombre: string;
  usuario: string;
  telefono: string | null;
  foto_perfil: string | null;
  perfiles: PerfilResumen[];
  secciones: Seccion[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
