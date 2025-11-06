import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string; // username
  id?: number; // user id
  roles?: string[]; // roles
  exp?: number; // expiration time (unix timestamp)
  iat?: number; // issued at
}

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly TOKEN_KEY = 'auth_token';

  // zapisanie tokena
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // pobranie tokena
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // usunięcie tokena (logout)
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // dekodowanie tokena
  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  // pobranie username (subject)
  getUsername(): string | null {
    return this.decodeToken()?.sub ?? null;
  }

  // pobranie id użytkownika
  getUserId(): number | null {
    return this.decodeToken()?.id ?? null;
  }

  // role
  getRoles(): string[] {
    return this.decodeToken()?.roles ?? [];
  }

  hasAdminRole(): boolean {
    const roles: string[] = this.getRoles();

    return roles.includes('ADMIN');
  }

  // sprawdzenie czy token wygasł
  isTokenExpired(): boolean {
    const exp = this.decodeToken()?.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }
}
