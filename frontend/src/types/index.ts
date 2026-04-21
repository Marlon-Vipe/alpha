export interface Producto {
  id: number;
  nombre: string;
  horario_operativo: string;
}

export interface CalcularFechasInput {
  producto: number;
  enReinversion: boolean;
  plazo: number;
  fechaCreacion: string;
}

export interface CalcularFechasOutput {
  producto: number;
  plazo: number;
  fechaInicio: string;
  fechaFin: string;
  plazoReal: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
