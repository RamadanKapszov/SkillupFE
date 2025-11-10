import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LessonReview,
  LessonReviewService,
} from 'src/app/core/services/lesson-review.service';
import { LessonService, Lesson } from 'src/app/core/services/lesson.service';
import { ProgressService } from 'src/app/core/services/progress.service';
import { TestService, Test } from 'src/app/core/services/test.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss'],
})
export class LessonDetailsComponent implements OnInit {
  lesson?: Lesson;
  loading = false;
  completed = false;
  checkingProgress = false;
  test?: Test;
  reviews: LessonReview[] = [];
  newReview = { rating: 0, comment: '' };
  submitting = false;
  averageRating = 0;
  editingReviewId: number | null = null;
  // 🧭 Sidebar data
  lessons: Lesson[] = [];
  totalLessons = 0;
  completedLessons = 0;
  progressPercent = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private progressService: ProgressService,
    private testService: TestService,
    private toast: ToastService,
    public reviewService: LessonReviewService // направено public за шаблона
  ) {}

  ngOnInit() {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.paramMap.subscribe((params) => {
      const lessonId = Number(params.get('id'));
      if (lessonId) {
        this.loadLesson(lessonId);
      }
    });
  }

  loadLesson(id: number) {
    this.loading = true;
    this.lessonService.getById(id).subscribe({
      next: (data) => {
        this.lesson = { ...data };
        this.loading = false;
        this.checkLessonStatus(id);
        this.loadTest(id);
        this.loadReviews(id);
        this.loadLessonsForSidebar(this.lesson.courseId);
      },
      error: () => (this.loading = false),
    });
  }

  markCompleted() {
    if (!this.lesson) return;
    this.progressService.completeLesson(this.lesson.id).subscribe({
      next: () => {
        this.toast.success('✅ Урокът е маркиран като завършен!');
        this.completed = true;
      },
      error: (err) => {
        if (err.error?.error === 'Lesson already completed') {
          this.toast.info('ℹ️ Вече си завършил този урок.');
          this.completed = true;
        } else {
          this.toast.error('❌ Неуспешно маркиране на урок.');
        }
      },
    });
  }

  loadTest(lessonId: number) {
    this.testService.getByLesson(lessonId).subscribe({
      next: (res) => (this.test = res),
      error: () => {},
    });
  }

  startTest() {
    if (this.test)
      this.router.navigate(['/tests/course', this.lesson?.courseId]);
    else this.toast.info('Този урок няма тест.');
  }

  goBack() {
    if (this.lesson) this.router.navigate(['/courses', this.lesson.courseId]);
  }

  loadReviews(lessonId: number) {
    this.reviewService.getByLesson(lessonId).subscribe({
      next: (res) => {
        this.reviews = res || [];
        if (this.reviews.length)
          this.averageRating =
            this.reviews.reduce((a, b) => a + b.rating, 0) /
            this.reviews.length;
      },
      error: () => (this.reviews = []),
    });
    console.log('Current user:', this.reviewService.currentUserId);
    console.log('Reviews:', this.reviews);
  }

  submitReview() {
    if (!this.lesson) return;
    if (this.newReview.rating === 0) {
      this.toast.info('⭐ Моля, изберете рейтинг.');
      return;
    }

    // ✏️ Ако редактираме
    if (this.editingReviewId) {
      this.submitting = true;
      this.reviewService
        .update(this.editingReviewId, {
          rating: this.newReview.rating,
          comment: this.newReview.comment,
        })
        .subscribe({
          next: () => {
            this.toast.success('💾 Ревюто е обновено успешно!');
            this.submitting = false;
            this.newReview = { rating: 0, comment: '' };
            this.editingReviewId = null;
            this.loadReviews(this.lesson!.id);
          },
          error: () => {
            this.toast.error('❌ Грешка при обновяване на ревюто.');
            this.submitting = false;
          },
        });
      return;
    }

    // 🆕 Ако добавяме ново ревю
    const hasReviewed = this.reviews.some(
      (r) => r.studentId === this.reviewService.currentUserId
    );
    if (hasReviewed) {
      this.toast.info('Вече сте оставили ревю за този урок.');
      return;
    }

    this.submitting = true;
    this.reviewService
      .create({
        lessonId: this.lesson.id,
        rating: this.newReview.rating,
        comment: this.newReview.comment,
      })
      .subscribe({
        next: () => {
          this.toast.success('✅ Успешно добавихте ревю!');
          this.submitting = false;
          this.newReview = { rating: 0, comment: '' };
          this.loadReviews(this.lesson!.id);
        },
        error: () => {
          this.toast.error('❌ Грешка при добавяне на ревю.');
          this.submitting = false;
        },
      });
  }

  editReview(review: LessonReview) {
    this.newReview = { rating: review.rating, comment: review.comment || '' };
    this.editingReviewId = review.id;
    this.toast.info('✏️ Режим на редакция активиран');
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.newReview = { rating: 0, comment: '' };
    this.toast.info('🚫 Редакцията е отменена');
  }

  deleteReview(id: number) {
    if (!confirm('Сигурни ли сте, че искате да изтриете това ревю?')) return;
    this.reviewService.delete(id).subscribe({
      next: () => {
        this.toast.success('🗑️ Ревюто е изтрито.');
        this.loadReviews(this.lesson!.id);
      },
      error: () => this.toast.error('❌ Неуспешно изтриване.'),
    });
  }

  isMyReview(review: LessonReview): boolean {
    return (
      Number(review.studentId) === Number(this.reviewService.currentUserId)
    );
  }

  nextLesson() {
    if (!this.lesson?.courseId) {
      this.toast.info('⚠️ Липсва информация за курса.');
      return;
    }

    // Ако вече имаме списъка с уроци
    if (this.lessons.length > 0) {
      const currentIndex = this.lessons.findIndex(
        (l) => l.id === this.lesson!.id
      );
      const next = this.lessons[currentIndex + 1];

      if (next) {
        this.router.navigate(['/lessons', next.id]);
      } else {
        this.toast.info('🎉 Това е последният урок от курса!');
      }
      return;
    }

    // Ако още не са заредени уроците, зареждаме и навигираме
    this.lessonService.getByCourse(this.lesson.courseId).subscribe({
      next: (allLessons) => {
        const sorted = allLessons.sort((a, b) => {
          const aIndex = a.orderIndex ?? a.id;
          const bIndex = b.orderIndex ?? b.id;
          return aIndex - bIndex;
        });

        const currentIndex = sorted.findIndex((l) => l.id === this.lesson!.id);
        const next = sorted[currentIndex + 1];

        if (next) {
          this.router.navigate(['/lessons', next.id]);
        } else {
          this.toast.info('🎓 Това е последният урок в курса.');
        }
      },
      error: () => {
        this.toast.error('❌ Неуспешно зареждане на уроците.');
      },
    });
  }

  checkLessonStatus(lessonId: number) {
    this.checkingProgress = true;
    this.progressService.getLessonStatus(lessonId).subscribe({
      next: (res) => {
        this.completed = res.isCompleted;
        this.checkingProgress = false;
      },
      error: () => (this.checkingProgress = false),
    });
  }
  // === 🧭 Sidebar Helpers ===

  // Зареждане на всички уроци за текущия курс
  loadLessonsForSidebar(courseId: number) {
    this.lessonService.getByCourse(courseId).subscribe({
      next: (res) => {
        this.lessons = res.sort(
          (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
        );
        this.totalLessons = this.lessons.length;

        // Ако потребителят е влезнал — зареждаме и прогреса
        this.loadProgress(courseId);
      },
      error: () => {
        this.lessons = [];
        this.totalLessons = 0;
      },
    });
  }

  // Зареждане на напредъка по курса
  loadProgress(courseId: number) {
    this.progressService.getCourseProgress(courseId).subscribe({
      next: (res) => {
        this.completedLessons = res.completedLessons || 0;
        this.totalLessons = res.totalLessons || this.totalLessons;
        this.progressPercent =
          this.totalLessons > 0
            ? Math.round((this.completedLessons / this.totalLessons) * 100)
            : 0;
      },
      error: () => {
        this.progressPercent = 0;
      },
    });
  }

  // Преглед на избран урок от sidebar-а
  viewLesson(lessonId: number) {
    if (lessonId && lessonId !== this.lesson?.id) {
      this.router.navigate(['/lessons', lessonId]);
    }
  }

  get currentUserId(): number | null {
    return this.reviewService.currentUserId;
  }
}
