import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService, AuthUser } from './auth.service';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthHttpService {
  constructor(private http: HttpClient) {}

  login(body: LoginRequest) {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/auth/login`,
      body
    );
  }

  register(body: RegisterRequest) {
    return this.http.post(`${environment.apiUrl}/auth/register`, body);
  }
}
