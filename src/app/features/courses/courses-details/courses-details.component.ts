import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/core/services/course.service';
import { LessonService } from 'src/app/core/services/lesson.service';
import { ProgressService } from 'src/app/core/services/progress.service';
import { Course } from 'src/app/core/models/course.model';
import { Lesson } from 'src/app/core/models/lesson.model';
import { UserCourseProgress } from 'src/app/core/models/user-course-progress.model';

@Component({
  selector: 'app-course-details',
  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  courseId!: number;
  course?: Course;
  lessons: Lesson[] = [];
  progress?: UserCourseProgress;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonService: LessonService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
  }

  loadCourse(): void {
    this.loading = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (c) => {
        this.course = c;
        this.loadLessons();
        this.loadProgress();
      },
      error: (err) => {
        this.error = 'Грешка при зареждане на курса';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadLessons(): void {
    this.lessonService.getLessonsByCourse(this.courseId).subscribe({
      next: (data) => {
        this.lessons = data;
        this.applyProgress();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Грешка при зареждане на уроците';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadProgress(): void {
    this.progressService.getCourseProgress(this.courseId).subscribe({
      next: (p) => {
        this.progress = p;
        this.applyProgress();
      },
      error: (err) => console.error('Не може да се вземе прогреса', err)
    });
  }

  applyProgress(): void {
    if (this.lessons.length && this.progress) {
          const completedLessonIds = new Set(
        this.lessons
          .filter(l => (this.progress?.completedLessons ?? 0) >= 1)
          .map(l => l.id)
      );


      this.lessons = this.lessons.map(l => ({
        ...l,
        isCompleted: completedLessonIds.has(l.id)
      }));
    }
  }

  markLessonComplete(lesson: Lesson): void {
    if (lesson.isCompleted) return;

    this.progressService.completeLesson(lesson.id).subscribe({
      next: () => {
        lesson.isCompleted = true;
        if (this.progress) this.progress.completedLessons += 1;
      },
      error: (err) => console.error('Не може да се отбележи урока като завършен', err)
    });
  }
}
