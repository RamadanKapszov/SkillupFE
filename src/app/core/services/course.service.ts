import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course } from '../models/course.model';
import { Lesson } from './lesson.service';

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private api: ApiService) {}

  getAll(params?: {
    categoryId?: number;
    q?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<Course>> {
    return this.api.get<PagedResult<Course>>('/courses', params);
  }

  getById(id: number | string): Observable<Course> {
    return this.api.get<Course>(`/courses/${id}`);
  }

  getLessons(courseId: number | string): Observable<Lesson[]> {
    return this.api.get<Lesson[]>(`/courses/${courseId}/lessons`);
  }

  create(course: Partial<Course>): Observable<Course> {
    return this.api.post<Course>('/courses', course);
  }

  update(id: number | string, course: Partial<Course>): Observable<void> {
    return this.api.put<void>(`/courses/${id}`, course);
  }

  delete(id: number | string): Observable<void> {
    return this.api.delete<void>(`/courses/${id}`);
  }

  enroll(courseId: number | string): Observable<void> {
    return this.api.post<void>(`/courses/${courseId}/enroll`, {});
  }

  getMyCourses(): Observable<Course[]> {
    return this.api.get<Course[]>('/courses/my');
  }

  getMyTeachingCourses(currentUserId: number): Observable<Course[]> {
    return this.getMyCourses().pipe(
      map((list) => (list || []).filter((c) => c.teacherId === currentUserId))
    );
  }

  getProgress(courseId: number | string): Observable<any> {
    return this.api.get<any>(`/courses/${courseId}/progress`);
  }

  getCompletedLessons(courseId: number | string): Observable<number[]> {
    return this.api.get<number[]>(`/courses/courses/${courseId}/completed`);
  }
}
