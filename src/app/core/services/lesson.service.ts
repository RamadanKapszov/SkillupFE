import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LessonReview {
  id: number;
  lessonId: number;
  studentId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
  studentUsername?: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  contentUrl?: string;
  orderIndex?: number;
  duration?: number;
  teacherUsername?: string;
  teacherAvatar?: string;
  averageRating?: number;
  reviews?: LessonReview[];
}

export interface LessonCreateDto {
  courseId: number;
  title: string;
  contentUrl?: string;
  orderIndex?: number;
  description?: string;
  duration?: number;
}

export interface LessonUpdateDto {
  title?: string;
  contentUrl?: string;
  orderIndex?: number;
  description?: string;
  duration?: number;
}

export interface ReviewCreateDto {
  rating: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  constructor(private api: ApiService) {}

  getByCourse(courseId: number | string): Observable<Lesson[]> {
    return this.api.get<Lesson[]>(`/lessons/course/${courseId}`);
  }

  getById(id: number): Observable<Lesson> {
    return this.api.get<Lesson>(`/lessons/${id}`);
  }

  create(dto: LessonCreateDto): Observable<Lesson> {
    return this.api.post<Lesson>('/lessons', dto);
  }

  update(id: number, dto: LessonUpdateDto): Observable<void> {
    return this.api.put<void>(`/lessons/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/lessons/${id}`);
  }

  addReview(
    lessonId: number,
    review: ReviewCreateDto
  ): Observable<LessonReview> {
    return this.api.post<LessonReview>(`/lessons/${lessonId}/reviews`, review);
  }

  get currentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user ? user.id : null;
  }
}
