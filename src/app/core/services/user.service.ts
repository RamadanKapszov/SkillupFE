import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
  totalPoints?: number;
  createdAt?: string;
}

export interface UpdateUserRoleRequest {
  role: 'Admin' | 'Teacher' | 'Student';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  updateRole(id: number, role: UpdateUserRoleRequest): Observable<void> {
    return this.api.put<void>(`/users/${id}/role`, role);
  }

  deleteUser(id: number): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.api.get<User>('/auth/me');
  }
}
