import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  LessonService,
  Lesson,
  LessonCreateDto,
  LessonUpdateDto,
} from 'src/app/core/services/lesson.service';
import {
  CourseService,
  PagedResult,
} from 'src/app/core/services/course.service';
import { Course } from 'src/app/core/models/course.model';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-admin-lessons',
  templateUrl: './admin-lessons.component.html',
  styleUrls: ['./admin-lessons.component.scss'],
})
export class AdminLessonsComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  coursesLoading = false;
  courseSearch = '';

  lessons: Lesson[] = [];
  lessonsLoading = false;
  lessonSearch = '';

  showCreateModal = false;
  showEditModal = false;
  submitting = false;
  selectedLesson: Lesson | null = null;

  createForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    contentUrl: [''],
    duration: [null as number | null],
    orderIndex: [null as number | null],
  });

  editForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    contentUrl: [''],
    duration: [null as number | null],
    orderIndex: [null as number | null],
  });

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private lessonService: LessonService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.coursesLoading = true;

    this.courseService.getAll({ page: 1, pageSize: 1000 }).subscribe({
      next: (res: PagedResult<Course>) => {
        this.courses = res.items || [];
        this.filteredCourses = [...this.courses];
        this.coursesLoading = false;

        if (!this.selectedCourse && this.courses.length > 0) {
          this.selectCourse(this.courses[0]);
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Грешка при зареждане на курсовете.');
        this.coursesLoading = false;
      },
    });
  }

  filterCourses() {
    const term = (this.courseSearch || '').toLowerCase().trim();
    this.filteredCourses = this.courses.filter((c) =>
      c.title?.toLowerCase().includes(term)
    );
  }

  selectCourse(course: Course) {
    if (!course || this.selectedCourse?.id === course.id) return;
    this.selectedCourse = course;
    this.loadLessons(course.id);
  }

  get filteredLessons(): Lesson[] {
    const term = (this.lessonSearch || '').toLowerCase().trim();
    if (!term) return this.lessons;
    return this.lessons.filter((l) => l.title?.toLowerCase().includes(term));
  }

  loadLessons(courseId: number) {
    this.lessonsLoading = true;
    this.lessonService.getByCourse(courseId).subscribe({
      next: (res) => {
        this.lessons = (res || []).sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );
        this.lessonsLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.toast.error('⚠️ Грешка при зареждане на уроците.');
        this.lessonsLoading = false;
      },
    });
  }

  openCreate() {
    if (!this.selectedCourse) {
      this.toast.warning('Първо изберете курс.');
      return;
    }
    this.createForm.reset({
      title: '',
      description: '',
      contentUrl: '',
      duration: null,
      orderIndex: (this.lessons.length || 0) + 1,
    });
    this.showCreateModal = true;
  }

  closeCreate() {
    this.showCreateModal = false;
    this.createForm.reset();
    this.submitting = false;
  }

  createLesson() {
    if (!this.selectedCourse) {
      this.toast.warning('Първо изберете курс.');
      return;
    }
    if (this.createForm.invalid) return;

    const raw = this.createForm.value;
    const dto: LessonCreateDto = {
      courseId: this.selectedCourse.id,
      title: (raw.title || '').trim(),
      description: raw.description || undefined,
      contentUrl: raw.contentUrl || undefined,
      duration:
        raw.duration !== null && raw.duration !== undefined
          ? Number(raw.duration)
          : undefined,
      orderIndex:
        raw.orderIndex !== null && raw.orderIndex !== undefined
          ? Number(raw.orderIndex)
          : undefined,
    };

    this.submitting = true;
    this.lessonService.create(dto).subscribe({
      next: (created) => {
        this.toast.success('✅ Урокът беше създаден успешно.');
        this.lessons.push(created);
        this.lessons.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        this.closeCreate();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Грешка при създаване на урок.');
        this.submitting = false;
      },
    });
  }

  openEdit(lesson: Lesson) {
    this.selectedLesson = lesson;
    this.editForm.reset({
      title: lesson.title,
      description: lesson.description || '',
      contentUrl: lesson.contentUrl || '',
      duration: lesson.duration ?? null,
      orderIndex: lesson.orderIndex ?? null,
    });
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.selectedLesson = null;
    this.editForm.reset();
    this.submitting = false;
  }

  updateLesson() {
    if (!this.selectedLesson) return;
    if (this.editForm.invalid) return;

    const raw = this.editForm.value;
    const dto: LessonUpdateDto = {
      title: raw.title ? raw.title.trim() : undefined,
      description: raw.description || undefined,
      contentUrl: raw.contentUrl || undefined,
      duration:
        raw.duration !== null && raw.duration !== undefined
          ? Number(raw.duration)
          : undefined,
      orderIndex:
        raw.orderIndex !== null && raw.orderIndex !== undefined
          ? Number(raw.orderIndex)
          : undefined,
    };

    this.submitting = true;
    this.lessonService.update(this.selectedLesson.id, dto).subscribe({
      next: () => {
        this.toast.success('💾 Промените по урока са запазени.');

        Object.assign(this.selectedLesson!, dto);
        this.lessons = [...this.lessons].sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );

        this.closeEdit();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Грешка при редакция на урока.');
        this.submitting = false;
      },
    });
  }

  deleteLesson(lesson: Lesson) {
    const ok = window.confirm(
      `Сигурни ли сте, че искате да изтриете урок: "${lesson.title}"?`
    );
    if (!ok) return;

    this.lessonService.delete(lesson.id).subscribe({
      next: () => {
        this.toast.success('🗑️ Урокът беше изтрит.');
        this.lessons = this.lessons.filter((l) => l.id !== lesson.id);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Неуспешно изтриване на урок.');
      },
    });
  }
}
