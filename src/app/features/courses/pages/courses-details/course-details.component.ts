import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/course.service';
import { Course } from 'src/app/core/models/course.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LessonService } from 'src/app/core/services/lesson.service';
import { EnrollmentService } from 'src/app/core/services/enrollment.service';
import { ProgressService } from 'src/app/core/services/progress.service';

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
  progressPercent = 0;
  completedLessons = 0;
  totalLessons = 0;
  showConfirmModal = false;

  private pendingUnenrollCourseId?: number;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonService: LessonService,
    private enrollmentService: EnrollmentService,
    private toast: ToastService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.courseService.getById(id).subscribe({
      next: (res) => {
        this.course = res;
        this.loading = false;

        // ✅ Always load lessons (for preview)
        this.loadLessons(res.id);

        // ✅ Load progress only if enrolled
        if (this.course.isEnrolled) {
          this.loadProgress(res.id);
        }
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
        this.lessons = data.sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );
        this.lessonsLoading = false;
      },
      error: () => {
        this.toast.error('⚠️ Неуспешно зареждане на уроците');
        this.lessonsLoading = false;
      },
    });
  }

  loadProgress(courseId: number) {
    this.progressService.getCourseProgress(courseId).subscribe({
      next: (progress) => {
        this.progressPercent = progress.percentCompleted ?? 0;
        this.completedLessons = progress.completedLessons ?? 0;
        this.totalLessons = progress.totalLessons ?? 0;
        console.log('Course progress:', progress);
      },
      error: (err) => {
        console.error('Error loading progress:', err);
        this.toast.warning('⚠️ Неуспешно зареждане на прогреса.');
      },
    });
  }

  enroll() {
    if (!this.course) return;

    this.enrollmentService.enroll(this.course.id).subscribe({
      next: () => {
        this.toast.success('✅ Успешно се записа за курса!');
        this.course!.isEnrolled = true;
        this.loadProgress(this.course!.id);
        this.loadLessons(this.course!.id); // 👈 load lessons after enroll
      },
      error: (err) => {
        if (err.error?.error === 'Already enrolled in this course.') {
          this.toast.info('ℹ️ Вече си записан за този курс.');
          this.course!.isEnrolled = true;
          this.loadProgress(this.course!.id);
          this.loadLessons(this.course!.id);
        } else if (
          err.error?.error === 'Teachers cannot enroll in their own course.'
        ) {
          this.toast.warning('⚠️ Не можеш да се запишеш в собствен курс.');
        } else {
          this.toast.error('❌ Възникна грешка при записването.');
        }
      },
    });
  }

  toggleEnrollment() {
    if (!this.course) return;

    // 🚪 Already enrolled → show confirmation modal
    if (this.course.isEnrolled) {
      this.openConfirmModal(this.course.id);
      return;
    }

    // 🎓 Not enrolled → enroll directly
    this.enrollmentService.enroll(this.course.id).subscribe({
      next: () => {
        this.toast.success('✅ Успешно се записа за курса!');
        this.course!.isEnrolled = true;

        // 🔄 Load progress and lessons immediately
        this.loadProgress(this.course!.id);
        this.loadLessons(this.course!.id);
      },
      error: (err) => {
        if (err.error?.error === 'Already enrolled in this course.') {
          this.toast.info('ℹ️ Вече си записан за този курс.');
          this.course!.isEnrolled = true;
          this.loadProgress(this.course!.id);
          this.loadLessons(this.course!.id);
        } else if (
          err.error?.error === 'Teachers cannot enroll in their own course.'
        ) {
          this.toast.warning('⚠️ Не можеш да се запишеш в собствен курс.');
        } else {
          this.toast.error('❌ Възникна грешка при записването.');
        }
      },
    });
  }

  openConfirmModal(courseId: number) {
    this.pendingUnenrollCourseId = courseId;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.pendingUnenrollCourseId = undefined;
  }

  confirmUnenroll() {
    if (!this.pendingUnenrollCourseId) return;

    this.enrollmentService.unenroll(this.pendingUnenrollCourseId).subscribe({
      next: () => {
        this.toast.info('🚪 Успешно се отписахте от курса.');
        this.course!.isEnrolled = false;
        this.progressPercent = 0;
        this.completedLessons = 0;
        this.totalLessons = 0;

        // Покажи заключените уроци веднага
        this.lessons = [...this.lessons];
        this.closeConfirmModal();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Грешка при отписването.');
        this.closeConfirmModal();
      },
    });
  }

  viewLesson(lessonId: number) {
    console.log('Navigating to lesson:', lessonId);
    this.router.navigate(['/lessons', lessonId]).then((success) => {
      console.log('Navigation result:', success);
    });
  }
}
