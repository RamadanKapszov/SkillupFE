import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService, Lesson } from 'src/app/core/services/lesson.service';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss'],
})
export class LessonDetailsComponent implements OnInit {
  lesson?: Lesson;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    if (lessonId) {
      this.loadLesson(lessonId);
    }
  }

  loadLesson(id: number) {
    this.loading = true;
    this.lessonService.getById(id).subscribe({
      next: (data) => {
        this.lesson = { ...data };
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  goBack() {
    if (this.lesson) {
      this.router.navigate(['/courses', this.lesson.courseId]);
    }
  }

  nextLesson() {
    // В бъдеще можем да вземем следващия урок по order
    alert('➡️ Следващ урок (функция предстои)');
  }
}
