import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface LessonReview {
  id: number;
  lessonId: number;
  studentId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
  studentUsername?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LessonReviewService {
  private baseUrl = `${environment.apiUrl}/lessonreviews`;

  constructor(private http: HttpClient) {}

  getByLesson(lessonId: number): Observable<LessonReview[]> {
    return this.http.get<LessonReview[]>(`${this.baseUrl}/lesson/${lessonId}`);
  }

  create(review: Partial<LessonReview>): Observable<LessonReview> {
    return this.http.post<LessonReview>(this.baseUrl, review);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  update(id: number, review: Partial<LessonReview>): Observable<LessonReview> {
    return this.http.put<LessonReview>(`${this.baseUrl}/${id}`, review);
  }

  get currentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('skillup.user') || 'null');
    return user && user.id ? Number(user.id) : null;
  }
}
