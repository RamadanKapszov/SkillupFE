import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  order: number;
  content?: string;
  videoUrl?: string;
  duration?: string;
  courseId?: number;
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
}
