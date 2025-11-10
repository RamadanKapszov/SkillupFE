import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  /** 🔹 Взимаме Dashboard данните за текущия потребител */
  getDashboard(userId: number): Observable<any> {
    return this.api.get(`/users/${userId}/dashboard`);
  }

  /** 🔹 Взимаме основна информация за потребителя */
  getUserById(userId: number): Observable<any> {
    return this.api.get(`/users/${userId}`);
  }

  /** 🔹 Обновяване на профил (bio, avatar и т.н.) */
  updateProfile(userId: number, data: any): Observable<any> {
    return this.api.put(`/users/${userId}/profile`, data);
  }
}
