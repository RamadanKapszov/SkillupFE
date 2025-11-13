import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Enrollment {
  id: number;
  courseId: number;
  courseTitle?: string;
  userId: number;
  username?: string;
  enrolledAt: string;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private api: ApiService) {}

  enroll(courseId: number) {
    return this.api.post('/enrollments', { courseId }); // ✅ wrap in object
  }

  unenroll(courseId: number) {
    return this.api.delete(`/enrollments/${courseId}`);
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>('/enrollments/my');
  }

  getEnrollmentsForCourse(courseId: number): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>(`/enrollments/course/${courseId}`);
  }

  removeEnrollment(enrollmentId: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/enrollments/${enrollmentId}`);
  }
}
