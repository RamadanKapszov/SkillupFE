import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserCourseProgress } from 'src/app/core/models/user-course-progress.model';
import { CourseService, Course } from 'src/app/core/services/course.service';
import {
  ProgressService,
  UserCourseProgressDto,
} from 'src/app/core/services/progress.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  course?: Course;
  progress?: UserCourseProgressDto;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private progressService: ProgressService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadCourse(id);
    this.loadProgress(id);
  }

  loadCourse(id: string) {
    this.loading = true;
    this.courseService.getById(id).subscribe({
      next: (res) => {
        this.course = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Грешка при зареждане на курса.';
        this.loading = false;
      },
    });
  }

  loadProgress(id: string) {
    this.progressService.getCourseProgress(id).subscribe({
      next: (res) => (this.progress = res),
    });
  }

  onLessonCompleted(lessonId: string) {
    this.progressService.completeLesson(lessonId).subscribe({
      next: () => {
        this.toast.success('Урокът е отбелязан като завършен!');
        this.loadProgress(this.course!.id);
      },
      error: () => this.toast.error('Грешка при отбелязване на урока.'),
    });
  }
}
