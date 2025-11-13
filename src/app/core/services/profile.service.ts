import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  getDashboard(userId: number): Observable<any> {
    return this.api.get(`/users/${userId}/dashboard`);
  }

  getUserById(userId: number): Observable<any> {
    return this.api.get(`/users/${userId}`);
  }

  updateProfile(data: any): Observable<any> {
    const userData = localStorage.getItem('skillup.user');
    const currentUser = userData ? JSON.parse(userData) : null;
    if (!currentUser?.id) throw new Error('User not logged in');

    return this.api.put(`/users/${currentUser.id}/profile`, data);
  }

  uploadAvatar(file: File): Observable<any> {
    const userData = localStorage.getItem('skillup.user');
    const currentUser = userData ? JSON.parse(userData) : null;
    if (!currentUser?.id) throw new Error('User not logged in');

    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(`/users/${currentUser.id}/avatar`, formData);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const userData = localStorage.getItem('skillup.user');
    const currentUser = userData ? JSON.parse(userData) : null;
    if (!currentUser?.id) throw new Error('User not logged in');

    return this.api.put(`/users/${currentUser.id}/change-password`, {
      oldPassword,
      newPassword,
    });
  }
}
