import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { CourseService } from 'src/app/core/services/course.service';
import { Course } from 'src/app/core/models/course.model';

import {
  LessonService,
  Lesson,
  LessonCreateDto,
  LessonUpdateDto,
} from 'src/app/core/services/lesson.service';

import { EnrollmentService } from 'src/app/core/services/enrollment.service';
import { ProgressService } from 'src/app/core/services/progress.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  course?: Course;
  lessons: Lesson[] = [];

  loading = true;
  lessonsLoading = true;

  // progress
  progressPercent = 0;
  completedLessons = 0;
  totalLessons = 0;

  // enroll confirm
  showConfirmModal = false;
  private pendingUnenrollCourseId?: number;

  // teacher permissions
  isTeacherOwner = false;
  currentUserId: number | null = null;
  currentRole: string | null = null;

  // lesson modals
  showAddLesson = false;
  showEditLesson = false;
  editingLesson: Lesson | null = null;
  submittingLesson = false;

  addLessonForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    contentUrl: [''],
    orderIndex: [null as number | null],
    duration: [null as number | null],
    description: [''],
  });

  editLessonForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    contentUrl: [''],
    orderIndex: [null as number | null],
    duration: [null as number | null],
    description: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private courseService: CourseService,
    private lessonService: LessonService,
    private enrollmentService: EnrollmentService,
    private progressService: ProgressService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const meRaw = localStorage.getItem('skillup.user');
    if (meRaw) {
      try {
        const me = JSON.parse(meRaw);
        this.currentUserId = Number(me?.id) || null;
        this.currentRole = me?.role || me?.Role || null;
      } catch {}
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadCourse(id);
  }

  /** Load course, decide permissions, load lessons + progress */
  private loadCourse(id: string | number) {
    this.loading = true;

    this.courseService.getById(id).subscribe({
      next: (res) => {
        this.course = res;
        this.loading = false;

        // decide if teacher owner (or admin)
        const isTeacher = (this.currentRole || '').toLowerCase() === 'teacher';
        const isAdmin = (this.currentRole || '').toLowerCase() === 'admin';

        this.isTeacherOwner =
          !!this.currentUserId &&
          (isAdmin ||
            (isTeacher && Number(res.teacherId) === this.currentUserId));

        // always show lessons (with preview when not enrolled)
        this.loadLessons(res.id);

        // progress only when enrolled
        if (res.isEnrolled) this.loadProgress(res.id);
      },
      error: () => {
        this.toast.error('❌ Грешка при зареждане на курса.');
        this.loading = false;
      },
    });
  }

  /** Lessons */
  loadLessons(courseId: number | string) {
    this.lessonsLoading = true;
    this.lessonService.getByCourse(courseId).subscribe({
      next: (list) => {
        this.lessons = (list || []).sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );
        this.lessonsLoading = false;
      },
      error: () => {
        this.toast.error('⚠️ Неуспешно зареждане на уроците.');
        this.lessonsLoading = false;
      },
    });
  }

  /** Progress */
  loadProgress(courseId: number) {
    this.progressService.getCourseProgress(courseId).subscribe({
      next: (p) => {
        this.progressPercent = p?.percentCompleted ?? 0;
        this.completedLessons = p?.completedLessons ?? 0;
        this.totalLessons = p?.totalLessons ?? 0;
      },
      error: () => this.toast.warning('⚠️ Неуспешно зареждане на прогреса.'),
    });
  }

  /** Enrollment */
  enroll() {
    if (!this.course) return;
    this.enrollmentService.enroll(this.course.id).subscribe({
      next: () => {
        this.toast.success('✅ Успешно се записа за курса!');
        this.course!.isEnrolled = true;
        this.loadProgress(this.course!.id);
        this.loadLessons(this.course!.id);
      },
      error: (err) => {
        if (err?.error?.error === 'Already enrolled in this course.') {
          this.toast.info('ℹ️ Вече си записан за този курс.');
          this.course!.isEnrolled = true;
          this.loadProgress(this.course!.id);
          this.loadLessons(this.course!.id);
        } else if (
          err?.error?.error === 'Teachers cannot enroll in their own course.'
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

    if (this.course.isEnrolled) {
      this.openConfirmModal(this.course.id);
      return;
    }
    this.enroll();
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
        if (this.course) {
          this.course.isEnrolled = false;
          this.progressPercent = 0;
          this.completedLessons = 0;
          this.totalLessons = 0;
        }
        this.closeConfirmModal();
      },
      error: () => {
        this.toast.error('❌ Грешка при отписването.');
        this.closeConfirmModal();
      },
    });
  }

  viewLesson(lessonId: number) {
    this.router.navigate(['/lessons', lessonId]);
  }

  openAddLesson() {
    this.addLessonForm.reset();
    const maxOrder =
      this.lessons.reduce((m, l) => Math.max(m, l.orderIndex ?? 0), 0) || 0;
    this.addLessonForm.patchValue({ orderIndex: maxOrder + 1 });
    this.showAddLesson = true;
  }
  closeAddLesson() {
    this.showAddLesson = false;
    this.submittingLesson = false;
  }

  createLesson() {
    if (!this.course) return;
    if (this.addLessonForm.invalid) return;

    const v = this.addLessonForm.value;
    const dto: LessonCreateDto = {
      courseId: this.course.id,
      title: v.title || '',
      contentUrl: v.contentUrl || undefined,
      orderIndex: v.orderIndex ?? undefined,
      description: v.description || undefined,
      ...(v.duration != null ? { duration: v.duration } : {}),
    } as any;

    this.submittingLesson = true;
    this.lessonService.create(dto).subscribe({
      next: (created) => {
        this.toast.success('✅ Урокът е създаден.');
        this.lessons = [...this.lessons, created].sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );
        this.closeAddLesson();
      },
      error: () => {
        this.toast.error('❌ Грешка при създаване на урок.');
        this.submittingLesson = false;
      },
    });
  }

  openEditLesson(lesson: Lesson, e?: MouseEvent) {
    if (e) e.stopPropagation();
    this.editingLesson = lesson;
    this.editLessonForm.reset({
      title: lesson.title,
      contentUrl: lesson.contentUrl || '',
      orderIndex: lesson.orderIndex ?? null,
      duration: lesson.duration ?? null,
      description: lesson.description || '',
    });
    this.showEditLesson = true;
  }
  closeEditLesson() {
    this.showEditLesson = false;
    this.editingLesson = null;
    this.submittingLesson = false;
  }

  updateLesson() {
    if (!this.editingLesson) return;
    if (this.editLessonForm.invalid) return;

    const v = this.editLessonForm.value;
    const dto: LessonUpdateDto = {
      title: v.title || undefined,
      contentUrl: v.contentUrl || undefined,
      orderIndex: v.orderIndex ?? undefined,
      description: v.description || undefined,
      ...(v.duration != null ? ({ duration: v.duration } as any) : {}),
    };

    this.submittingLesson = true;
    this.lessonService.update(this.editingLesson.id, dto).subscribe({
      next: () => {
        this.toast.success('💾 Урокът е обновен.');
        // update locally
        this.lessons = this.lessons
          .map((l) =>
            l.id === this.editingLesson!.id
              ? {
                  ...l,
                  ...dto,
                }
              : l
          )
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        this.closeEditLesson();
      },
      error: () => {
        this.toast.error('❌ Неуспешно обновяване на урок.');
        this.submittingLesson = false;
      },
    });
  }

  deleteLesson(lesson: Lesson, e?: MouseEvent) {
    if (e) e.stopPropagation();

    this.confirmFancy(
      '🗑️ Изтриване на урок',
      `Сигурни ли сте, че искате да изтриете <strong>"${lesson.title}"</strong>?`,
      'Откажи',
      'Изтрий',
      () => {
        this.lessonService.delete(lesson.id).subscribe({
          next: () => {
            this.toast.success('🗑️ Урокът е изтрит.');
            this.lessons = this.lessons.filter((l) => l.id !== lesson.id);
          },
          error: () => this.toast.error('❌ Неуспешно изтриване.'),
        });
      }
    );
  }

  /** Pretty confirm overlay (reusable) */
  private confirmFancy(
    title: string,
    message: string,
    cancelText: string,
    okText: string,
    onConfirm: () => void
  ) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-modal">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="actions">
          <button class="btn ghost cancel-btn">${cancelText}</button>
          <button class="btn danger confirm-btn">${okText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const cancel = overlay.querySelector('.cancel-btn') as HTMLButtonElement;
    const ok = overlay.querySelector('.confirm-btn') as HTMLButtonElement;

    const close = () => overlay.remove();
    cancel.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    ok.addEventListener('click', () => {
      close();
      onConfirm();
    });
  }
}
