import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(private api: ApiService) {}

  getAll(): Observable<any[]> {
    return this.api.get<any[]>('/users');
  }

  getById(id: number): Observable<any> {
    return this.api.get(`/users/${id}`);
  }

  updateRole(id: number, role: string) {
    return this.api.put(`/users/${id}/role`, { role });
  }

  updateProfile(id: number, dto: any) {
    const payload = {
      username: dto.username,
      email: dto.email,
      avatarUrl: dto.avatarUrl,
      bio: dto.bio,
    };
    return this.api.put(`/users/${id}/profile`, payload);
  }

  delete(id: number) {
    return this.api.delete(`/users/${id}`);
  }
}
