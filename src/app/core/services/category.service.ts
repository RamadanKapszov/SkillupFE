import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Category {
  id: number;
  name: string;
  description?: string;
  courseCount?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Category[]> {
    return this.api.get<Category[]>('/categories');
  }

  getById(id: number): Observable<Category> {
    return this.api.get<Category>(`/categories/${id}`);
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.api.post<Category>('/categories', category);
  }

  update(id: number, category: Partial<Category>): Observable<void> {
    return this.api.put<void>(`/categories/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
