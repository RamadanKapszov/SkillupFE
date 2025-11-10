import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CourseService,
  PagedResult,
} from 'src/app/core/services/course.service';
import { Course } from 'src/app/core/models/course.model';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  selectedCategoryId: number | null = null;
  categoryName: string | null = null;

  // pagination (optional)
  page = 1;
  pageSize = 20;
  totalCount = 0;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Watch for categoryId in URL
    this.route.queryParams.subscribe((params) => {
      this.selectedCategoryId = params['categoryId']
        ? +params['categoryId']
        : null;
      this.loadCourses();
    });
  }

  loadCourses() {
    this.loading = true;

    this.courseService
      .getAll({
        categoryId: this.selectedCategoryId ?? undefined,
        page: this.page,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (res: PagedResult<Course>) => {
          // ✅ Backend now returns PagedResult<Course>
          this.courses = res.items || [];
          this.totalCount = res.totalCount;

          if (this.selectedCategoryId && this.courses.length > 0) {
            this.categoryName = this.courses[0].categoryName ?? null;
          } else {
            this.categoryName = null;
          }

          console.log('✅ Loaded courses:', this.courses);
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error loading courses:', err);
          this.loading = false;
        },
      });
  }

  viewCourse(id: number) {
    this.router.navigate(['/courses', id]);
  }

  goBack() {
    this.router.navigate(['/categories']);
  }
}
