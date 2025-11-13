import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class AdminCoursesService {
  constructor(private api: ApiService) {}

  getPaged(params?: {
    categoryId?: number;
    q?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<any>> {
    return this.api.get<PagedResult<any>>('/courses', params);
  }

  update(id: number, dto: any) {
    return this.api.put(`/courses/${id}`, dto);
  }

  delete(id: number) {
    return this.api.delete(`/courses/${id}`);
  }
}
