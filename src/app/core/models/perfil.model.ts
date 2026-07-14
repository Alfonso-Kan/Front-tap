import { Seccion } from './seccion.model';

export interface Perfil {
  id: string;
  codigo: string;
  nombre: string;
  fecha_creacion: string;
  secciones?: Seccion[];
  protegido?: boolean;
}
