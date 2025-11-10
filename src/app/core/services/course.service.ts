import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course } from '../models/course.model';
import { Lesson } from './lesson.service';

// Optional — backend supports pagination
export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private api: ApiService) {}

  // 🟢 PUBLIC: Get all courses (with optional filters)
  getAll(params?: {
    categoryId?: number;
    q?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<Course>> {
    return this.api.get<PagedResult<Course>>('/courses', params);
  }

  // 🟢 PUBLIC: Get single course details
  getById(id: number | string): Observable<Course> {
    return this.api.get<Course>(`/courses/${id}`);
  }

  // 🟡 AUTH: Get lessons for this course (requires login)
  getLessons(courseId: number | string): Observable<Lesson[]> {
    return this.api.get<Lesson[]>(`/courses/${courseId}/lessons`);
  }

  // 🟣 ADMIN / TEACHER: Create course
  create(course: Partial<Course>): Observable<Course> {
    return this.api.post<Course>('/courses', course);
  }

  // 🟣 ADMIN / TEACHER: Update course
  update(id: number | string, course: Partial<Course>): Observable<void> {
    return this.api.put<void>(`/courses/${id}`, course);
  }

  // 🟣 ADMIN / TEACHER: Delete course
  delete(id: number | string): Observable<void> {
    return this.api.delete<void>(`/courses/${id}`);
  }

  // 🟠 STUDENT: Enroll in a course
  enroll(courseId: number | string): Observable<void> {
    return this.api.post<void>(`/courses/${courseId}/enroll`, {});
  }

  // 🟢 AUTH: Get courses the current user teaches or is enrolled in
  getMyCourses(): Observable<Course[]> {
    return this.api.get<Course[]>('/courses/mycourses');
  }

  // 🟢 AUTH: Get progress for current user in a course
  getProgress(courseId: number | string): Observable<any> {
    return this.api.get<any>(`/courses/${courseId}/progress`);
  }

  // 🟢 AUTH: Get completed lesson IDs for this course
  getCompletedLessons(courseId: number | string): Observable<number[]> {
    return this.api.get<number[]>(`/courses/courses/${courseId}/completed`);
  }
}
