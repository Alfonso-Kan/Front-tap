export interface PerfilResumen {
  id: string;
  codigo: string;
  nombre: string;
}

export interface Usuario {
  id: string;
  codigo: string;
  usuario: string;
  nombre: string;
  fecha_creacion: string;
  telefono?: string | null;
  foto_perfil?: string | null;
  perfiles?: PerfilResumen[];
  correo_enviado?: boolean;
  protegido?: boolean;
}
