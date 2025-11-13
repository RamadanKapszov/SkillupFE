import { Component, OnInit } from '@angular/core';
import {
  AdminDashboardService,
  AdminSummary,
  TopCourse,
  TopStudent,
  TopTeacher,
} from 'src/app/core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  error = false;

  summary: AdminSummary | null = null;
  topCourses: TopCourse[] = [];
  topStudents: TopStudent[] = [];
  topTeachers: TopTeacher[] = [];

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = false;

    this.adminService.getSummary().subscribe({
      next: (s) => {
        this.summary = s;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });

    this.adminService.getTopCourses(5).subscribe({
      next: (c) => (this.topCourses = c || []),
      error: () => (this.topCourses = []),
    });

    this.adminService.getTopStudents(5).subscribe({
      next: (s) => (this.topStudents = s || []),
      error: () => (this.topStudents = []),
    });

    this.adminService.getTopTeachers(5).subscribe({
      next: (t) => (this.topTeachers = t || []),
      error: () => (this.topTeachers = []),
    });
  }
}
