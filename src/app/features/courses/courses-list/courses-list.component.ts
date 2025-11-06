import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from 'src/app/core/services/course.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  error = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.error = '';
    this.courseService.getAll().subscribe({
      next: (res) => {
        this.courses = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Грешка при зареждане на курсовете.';
      },
    });
  }
}
