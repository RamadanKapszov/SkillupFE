import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Course[]> {
    return this.api.get<Course[]>('/courses');
  }

  getById(id: string): Observable<Course> {
    return this.api.get<Course>(`/courses/${id}`);
  }

  create(course: Partial<Course>): Observable<Course> {
    return this.api.post<Course>('/courses', course);
  }

  update(id: string, course: Partial<Course>): Observable<Course> {
    return this.api.put<Course>(`/courses/${id}`, course);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/courses/${id}`);
  }

  // Ако записването е през отделен енпойнт /enrollments
  enroll(courseId: string): Observable<void> {
    return this.api.post<void>('/enrollments', { courseId });
  }
}
