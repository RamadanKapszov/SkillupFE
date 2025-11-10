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

  /** Admin: Get all users */
  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  /** Admin: Get user by ID */
  getById(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  /** Admin: Update user role */
  updateRole(id: number, role: UpdateUserRoleRequest): Observable<void> {
    return this.api.put<void>(`/users/${id}/role`, role);
  }

  /** Admin: Delete a user */
  deleteUser(id: number): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }

  /** Student/Teacher/Admin: Get my user info */
  getCurrentUser(): Observable<User> {
    return this.api.get<User>('/auth/me');
  }
}
