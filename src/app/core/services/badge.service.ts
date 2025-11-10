import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Badge {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  conditionType?: string;
  threshold?: number;
}

@Injectable({ providedIn: 'root' })
export class BadgeService {
  constructor(private api: ApiService) {}

  /** Admin: Get all badges */
  getAll(): Observable<Badge[]> {
    return this.api.get<Badge[]>('/badges');
  }

  /** Admin: Get a badge by ID */
  getById(id: number): Observable<Badge> {
    return this.api.get<Badge>(`/badges/${id}`);
  }

  /** Admin: Create a badge */
  create(badge: Partial<Badge>): Observable<Badge> {
    return this.api.post<Badge>('/badges', badge);
  }

  /** Admin: Update a badge */
  update(id: number, badge: Partial<Badge>): Observable<void> {
    return this.api.put<void>(`/badges/${id}`, badge);
  }

  /** Admin: Delete a badge */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/badges/${id}`);
  }

  /** Student: Get my earned badges */
  getMyBadges(): Observable<Badge[]> {
    return this.api.get<Badge[]>('/progress/badges');
  }
}
