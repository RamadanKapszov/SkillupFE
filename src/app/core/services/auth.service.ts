import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Teacher' | 'Student';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'skillup.token';
  private readonly USER_KEY = 'skillup.user';
  private jwt = new JwtHelperService();
  private _currentUser: AuthUser | null = null;

  constructor(private router: Router) {
    this.tryLoadUserFromStorage();
  }

  // ===========================
  // 🔑 TOKEN MANAGEMENT
  // ===========================

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.decodeTokenAndStoreUser(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ===========================
  // 👤 USER MANAGEMENT
  // ===========================

  setCurrentUser(user: AuthUser) {
    this._currentUser = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  get currentUser(): AuthUser | null {
    if (this._currentUser) return this._currentUser;

    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      this._currentUser = JSON.parse(raw) as AuthUser;
      return this._currentUser;
    } catch {
      return null;
    }
  }

  get userRole(): AuthUser['role'] | null {
    return this.currentUser?.role ?? null;
  }

  clearCurrentUser() {
    this._currentUser = null;
    localStorage.removeItem(this.USER_KEY);
  }

  // ===========================
  // ✅ AUTH STATE
  // ===========================

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwt.isTokenExpired(token);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  hasRole(...roles: Array<AuthUser['role']>): boolean {
    const user = this.currentUser;
    return !!user && roles.includes(user.role);
  }

  logout() {
    this.clearToken();
    this.clearCurrentUser();
    this.router.navigate(['/auth/login']);
  }

  // ===========================
  // 🔍 HELPERS
  // ===========================

  private tryLoadUserFromStorage() {
    const token = this.getToken();
    if (token && !this.jwt.isTokenExpired(token)) {
      if (!this.currentUser) {
        this.decodeTokenAndStoreUser(token);
      }
    } else {
      this.logout();
    }
  }

  private decodeTokenAndStoreUser(token: string) {
    try {
      const decoded: any = this.jwt.decodeToken(token);
      const user: AuthUser = {
        id: decoded.nameid || decoded.sub || '',
        email: decoded.email || '',
        fullName: decoded.fullName || decoded.unique_name || '',
        role:
          decoded.role ||
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] ||
          'Student',
      };
      this.setCurrentUser(user);
    } catch (err) {
      console.error('Error decoding token', err);
    }
  }
}
