import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TestService,
  Test,
  TestResult,
} from 'src/app/core/services/test.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
  testTitle = '';
  questions: any[] = [];
  answers: Record<number, any> = {};
  submitted = false;
  score = 0;
  timeLeft = 600; // 10 минути за пример
  timer?: any;
  testId?: number;
  maxPoints = 0;
  courseId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    if (courseId) {
      this.courseId = courseId;
      this.loadTestByCourse(courseId);
    }
  }

  /** ⏱️ Форматиране на времето */
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  loadTestByCourse(courseId: number) {
    this.testService.getByCourse(courseId).subscribe({
      next: (res: any) => {
        console.log('Loaded test by course:', res);
        this.testId = res.id;
        this.testTitle = res.title;

        this.questions = (res.questions || []).map((q: any) => {
          let typeText = 'single';
          if (q.type === 1) typeText = 'multiple';
          else if (q.type === 2) typeText = 'text';

          return {
            id: q.id,
            text: q.text,
            type: typeText,
            points: q.points,
            options: q.options || [],
          };
        });

        this.maxPoints = this.questions.reduce(
          (sum, q) => sum + (q.points || 0),
          0
        );

        // start timer
        this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            clearInterval(this.timer);
            this.submitTest();
          }
        }, 1000);
      },
      error: () => this.toast.error('❌ Грешка при зареждане на теста.'),
    });
  }

  /** 🟩 Избиране на единичен отговор */
  selectAnswer(questionId: number, option: string) {
    this.answers[questionId] = option;
  }

  /** 🟦 Добавяне/махане на отговор при multiple choice */
  toggleMultiAnswer(questionId: number, option: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const selected = this.answers[questionId] || [];

    if (input.checked) {
      this.answers[questionId] = [...selected, option];
    } else {
      this.answers[questionId] = selected.filter((x: string) => x !== option);
    }
  }

  submitTest() {
    if (this.submitted) return;

    this.submitted = true;
    clearInterval(this.timer);

    const formattedAnswers: Record<number, string> = {};
    for (const q of this.questions) {
      const ans = this.answers[q.id];
      formattedAnswers[q.id] = Array.isArray(ans) ? JSON.stringify(ans) : ans;
    }

    const testId = this.testId;
    if (!testId) {
      this.toast.error('❌ Тестът не е намерен.');
      return;
    }

    this.testService.submitTest(testId, formattedAnswers).subscribe({
      next: (res: TestResult) => {
        const maxPoints = this.maxPoints || res.maxPoints;
        const percent = Math.round((res.score / maxPoints) * 100);
        this.score = percent;
        this.toast.success('✅ Тестът е предаден успешно!');
      },
      error: () => {
        this.toast.error('❌ Възникна грешка при предаването на теста.');
        this.submitted = false;
      },
    });
  }

  goBackToLesson() {
    if (this.courseId) {
      this.router.navigate(['/courses', this.courseId]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
