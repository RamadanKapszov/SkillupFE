import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LessonProgressDto {
  lessonId: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface UserCourseProgressDto {
  id: number;
  title: string;
  totalLessons: number;
  completedLessons: number;
  percentCompleted: number;
}

export interface BadgeDto {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private api: ApiService) {}

  completeLesson(lessonId: number): Observable<{ message: string }> {
    return this.api.post<{ message: string }>(
      `/progress/lessons/${lessonId}/complete`,
      {}
    );
  }

  getLessonStatus(lessonId: number): Observable<{ isCompleted: boolean }> {
    return this.api.get<{ isCompleted: boolean }>(
      `/progress/lessons/${lessonId}/status`
    );
  }

  getUserPoints(): Observable<{ points: number }> {
    return this.api.get<{ points: number }>(`/progress/points`);
  }

  getUserBadges(): Observable<BadgeDto[]> {
    return this.api.get<BadgeDto[]>(`/progress/badges`);
  }

  getCourseProgress(courseId: number): Observable<UserCourseProgressDto> {
    return this.api.get<UserCourseProgressDto>(
      `/progress/courses/${courseId}/progress`
    );
  }

  getCompletedLessons(courseId: number): Observable<number[]> {
    return this.api.get<number[]>(`/courses/courses/${courseId}/completed`);
  }
}
