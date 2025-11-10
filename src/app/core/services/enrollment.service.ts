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

  /** Student enrolls in a course */
  enroll(courseId: number) {
    return this.api.post('/enrollments', { courseId }); // ✅ wrap in object
  }

  /** Student unenrolls from a course */
  unenroll(courseId: number) {
    return this.api.delete(`/enrollments/${courseId}`);
  }

  /** Current user's enrollments */
  getMyEnrollments(): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>('/enrollments/my');
  }

  /** Teacher/Admin: list all students in a course */
  getEnrollmentsForCourse(courseId: number): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>(`/enrollments/course/${courseId}`);
  }

  /** Teacher/Admin: remove enrollment */
  removeEnrollment(enrollmentId: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/enrollments/${enrollmentId}`);
  }
}
