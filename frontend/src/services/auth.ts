import axios from 'axios';
import { AuthTokens } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const login = async (username: string, password: string): Promise<AuthTokens> => {
  const response = await axios.post<AuthTokens>(`${API_URL}/api/auth/token/`, {
    username,
    password,
  });
  return response.data;
};

export const saveTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
};

export const getAccessToken = (): string | null => localStorage.getItem('access_token');

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => !!getAccessToken();
