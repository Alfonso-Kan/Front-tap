export interface Bitacora {
  id: string;
  coleccion: string;
  documento_id: string;
  accion: 'creacion' | 'actualizacion' | 'eliminacion';
  datos_anteriores: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  usuario: { id: string; usuario: string; nombre: string } | null;
  fecha: string;
}
