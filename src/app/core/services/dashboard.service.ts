import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardSummary {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
}

export interface TopCourse {
  id: number;
  title: string;
  enrolledCount: number;
}

export interface TopStudent {
  id: number;
  username: string;
  email: string;
  totalPoints: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  /** Get summary counts */
  getSummary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>('/admin-dashboard/summary');
  }

  /** Get top courses by enrollment */
  getTopCourses(top: number = 5): Observable<TopCourse[]> {
    return this.api.get<TopCourse[]>(`/admin-dashboard/top-courses?top=${top}`);
  }

  /** Get top students by points */
  getTopStudents(top: number = 5): Observable<TopStudent[]> {
    return this.api.get<TopStudent[]>(
      `/admin-dashboard/top-students?top=${top}`
    );
  }
}
