import axios from 'axios';
import { getAccessToken, logout } from './auth';
import { Producto, CalcularFechasInput, CalcularFechasOutput } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get<Producto[]>('/api/productos/');
  return response.data;
};

export const calcularFechas = async (data: CalcularFechasInput): Promise<CalcularFechasOutput> => {
  const response = await api.post<CalcularFechasOutput>('/api/inversiones/calcular/', data);
  return response.data;
};
