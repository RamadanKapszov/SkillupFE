import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LessonProgressDto {
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface UserCourseProgressDto {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  lessons: LessonProgressDto[];
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private api: ApiService) {}

  getCourseProgress(courseId: string): Observable<UserCourseProgressDto> {
    return this.api.get<UserCourseProgressDto>(`/progress/course/${courseId}`);
  }

  completeLesson(lessonId: string): Observable<void> {
    return this.api.post<void>(`/progress/lessons/${lessonId}/complete`, {});
  }
}
