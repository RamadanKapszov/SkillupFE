import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TestQuestion {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  points?: number;
  correctAnswer?: string;
}

export interface Test {
  id: number;
  title: string;
  maxPoints: number;
  lessonId?: number;
  questions: TestQuestion[];
}

export interface TestResult {
  score: number;
  maxPoints: number;
  percentage?: number;
}

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private api: ApiService) {}

  getById(id: number): Observable<Test> {
    return this.api.get<Test>(`/tests/${id}`);
  }

  getByLesson(lessonId: number): Observable<Test> {
    return this.api.get<Test>(`/tests/lesson/${lessonId}`);
  }

  getByCourse(courseId: number): Observable<Test> {
    return this.api.get<Test>(`/tests/course/${courseId}`);
  }

  submitTest(
    testId: number,
    answers: Record<number, string>
  ): Observable<TestResult> {
    return this.api.post<TestResult>(`/tests/${testId}/submit`, answers);
  }

  getUserResult(testId: number): Observable<TestResult> {
    return this.api.get<TestResult>(`/tests/${testId}/result`);
  }
}
