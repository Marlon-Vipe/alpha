export interface Product {
  id: number;
  name: string;
  operating_time: string;
}

export interface InvestmentInput {
  producto: number;
  enReinversion: boolean;
  plazo: number;
  fechaCreacion: string;
}

export interface InvestmentResult {
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
