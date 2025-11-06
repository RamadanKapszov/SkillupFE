import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/course.service';
import { Course } from 'src/app/core/models/course.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LessonService } from 'src/app/core/services/lesson.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  course?: Course;
  lessons: any[] = [];
  loading = true;
  lessonsLoading = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonService: LessonService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.courseService.getById(id).subscribe({
      next: (res) => {
        this.course = res;
        this.loading = false;
        this.loadLessons(res.id);
      },
      error: () => {
        this.toast.error('❌ Грешка при зареждане на курса');
        this.loading = false;
      },
    });
  }

  loadLessons(courseId: number | string) {
    this.lessonsLoading = true;
    this.lessonService.getByCourse(courseId).subscribe({
      next: (data) => {
        this.lessons = data.sort((a, b) => a.order - b.order);
        this.lessonsLoading = false;
      },
      error: () => {
        this.toast.error('⚠️ Неуспешно зареждане на уроците');
        this.lessonsLoading = false;
      },
    });
  }

  enroll() {
    this.toast.info('🔜 Записването все още не е активно.');
  }

  viewLesson(lessonId: number) {
    this.router.navigate(['/courses/lesson', lessonId]);
  }
}
