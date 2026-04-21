import axios from 'axios';
import type { AuthTokens } from '../types';

const ACCESS_KEY = 'alpha_access';
const REFRESH_KEY = 'alpha_refresh';

export const authService = {
  async login(username: string, password: string): Promise<void> {
    const { data } = await axios.post<AuthTokens>('/api/token/', { username, password });
    localStorage.setItem(ACCESS_KEY, data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);
  },

  logout(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(ACCESS_KEY);
  },

  async refreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) return false;
    try {
      const { data } = await axios.post<{ access: string }>('/api/token/refresh/', { refresh });
      localStorage.setItem(ACCESS_KEY, data.access);
      return true;
    } catch {
      this.logout();
      return false;
    }
  },
};
