import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCourseProgress } from '../models/user-course-progress.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) {}

  // Отбелязване на урок като завършен
  completeLesson(lessonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/lessons/${lessonId}/complete`, {});
  }

  // Връща прогреса на текущия потребител за даден курс
  getCourseProgress(courseId: number): Observable<UserCourseProgress> {
    return this.http.get<UserCourseProgress>(`${this.apiUrl}/courses/${courseId}/progress`);
  }
}
