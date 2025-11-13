import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AdminSummary {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
  totalTests: number;
  totalBadges: number;
}

export interface TopCourse {
  id: number;
  title: string;
  teacher: string;
  enrolledCount: number;
}

export interface TopStudent {
  id: number;
  username: string;
  email: string;
  totalPoints: number;
}

export interface TopTeacher {
  id: number;
  username: string;
  courseCount: number;
}

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  constructor(private api: ApiService) {}

  getSummary(): Observable<AdminSummary> {
    return this.api.get<AdminSummary>('/adminDashboard/summary');
  }

  getTopCourses(top = 5): Observable<TopCourse[]> {
    return this.api.get<TopCourse[]>('/adminDashboard/top-courses', { top });
  }

  getTopStudents(top = 5): Observable<TopStudent[]> {
    return this.api.get<TopStudent[]>('/adminDashboard/top-students', { top });
  }

  getTopTeachers(top = 5): Observable<TopTeacher[]> {
    return this.api.get<TopTeacher[]>('/adminDashboard/top-teachers', { top });
  }
}
