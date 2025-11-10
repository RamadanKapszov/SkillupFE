import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TestQuestion {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[]; // ✅ direct array (not stringified)
  points?: number;
  correctAnswer?: string; // (only visible to teachers/admins)
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

  /** ✅ Get test by its ID (used on /tests/:id page) */
  getById(id: number): Observable<Test> {
    return this.api.get<Test>(`/tests/${id}`);
  }

  /** ✅ Get test attached to a specific lesson */
  getByLesson(lessonId: number): Observable<Test> {
    return this.api.get<Test>(`/tests/lesson/${lessonId}`);
  }

  getByCourse(courseId: number): Observable<Test> {
    return this.api.get<Test>(`/tests/course/${courseId}`);
  }

  /** ✅ Submit answers and get evaluated result */
  submitTest(
    testId: number,
    answers: Record<number, string>
  ): Observable<TestResult> {
    return this.api.post<TestResult>(`/tests/${testId}/submit`, answers);
  }

  /** 🧾 Optionally — get previous attempt result (if needed later) */
  getUserResult(testId: number): Observable<TestResult> {
    return this.api.get<TestResult>(`/tests/${testId}/result`);
  }
}
