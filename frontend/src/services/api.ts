import axios from 'axios';
import { authService } from './auth';
import type { Product, InvestmentInput, InvestmentResult } from '../types';

const client = axios.create();

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 try to refresh once, then redirect to login
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await authService.refreshToken();
      if (refreshed) {
        error.config.headers.Authorization = `Bearer ${authService.getAccessToken()}`;
        return client.request(error.config);
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await client.get<Product[]>('/api/productos/');
    return data;
  },

  async calculateDates(input: InvestmentInput): Promise<InvestmentResult> {
    const { data } = await client.post<InvestmentResult>('/api/calcular/', input);
    return data;
  },
};
