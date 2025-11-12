import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/core/services/course.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
})
export class TeacherDashboardComponent implements OnInit {
  stats = { courses: 0, students: 0, avgRating: 0 };
  courses: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.courseService.getMyCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.stats.courses = courses.length;

        // ✅ Real calculation based on backend data
        this.stats.students = courses.reduce(
          (sum: number, c: any) => sum + (c.studentsCount || 0),
          0
        );

        this.stats.avgRating = courses.length
          ? courses.reduce(
              (s: number, c: any) => s + (c.averageRating || 0),
              0
            ) / courses.length
          : 0;
      },
      error: (err) => console.error(err),
    });
  }
}
