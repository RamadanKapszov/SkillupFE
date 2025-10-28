import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from 'src/app/core/services/course.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        console.log('Courses from API:', data);
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Грешка при зареждане на курсовете';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
