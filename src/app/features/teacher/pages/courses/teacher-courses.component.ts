import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CourseService } from 'src/app/core/services/course.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Course } from 'src/app/core/models/course.model';

@Component({
  selector: 'app-teacher-courses',
  templateUrl: './teacher-courses.component.html',
  styleUrls: ['./teacher-courses.component.scss'],
})
export class TeacherCoursesComponent implements OnInit {
  myCourses: Course[] = [];
  filtered: Course[] = [];
  q = '';

  showCreate = false;
  showEdit = false;
  submitting = false;

  selectedCourse: Course | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    categoryId: [null as number | null, [Validators.required]], // <---- ТУК
    shortDescription: [''],
    description: [''],
    level: [''],
    duration: [''],
    language: [''],
    imageUrl: [''],
    tags: [''],
  });

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  /** 🟢 Зареждане на курсовете */
  loadCourses() {
    const me = JSON.parse(localStorage.getItem('skillup.user') || 'null');
    const myId = Number(me?.id);

    this.courseService.getMyTeachingCourses(myId).subscribe({
      next: (res) => {
        this.myCourses = res || [];
        this.filtered = [...this.myCourses];
      },
      error: (err) => console.error('Load error:', err),
    });
  }

  /** 🔍 Филтриране по заглавие */
  filter() {
    const term = (this.q || '').toLowerCase();
    this.filtered = this.myCourses.filter((c) =>
      c.title?.toLowerCase().includes(term)
    );
  }

  /** ➕ Създаване */
  openCreate() {
    this.showCreate = true;
  }

  closeCreate() {
    this.showCreate = false;
    this.form.reset();
    this.submitting = false;
  }

  create() {
    if (this.form.invalid) return;
    const me = JSON.parse(localStorage.getItem('skillup.user') || 'null');
    const teacherId = Number(me?.id);

    const raw = this.form.value;
    const payload = Object.fromEntries(
      Object.entries(this.form.value).map(([k, v]) => [k, v || undefined])
    ) as Partial<Course>;

    this.submitting = true;
    this.courseService.create(payload).subscribe({
      next: (created) => {
        this.toast.success('✅ Курсът е създаден успешно.');
        this.loadCourses();
        this.closeCreate();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Възникна грешка при създаването.');
        this.submitting = false;
      },
    });
  }

  /** ✏️ Отваря форма за редакция */
  edit(course: Course) {
    this.selectedCourse = course;
    this.form.patchValue({
      title: course.title,
      categoryId: course.categoryId,
      shortDescription: course.shortDescription,
      description: course.description,
      level: course.level,
      duration: course.duration,
      language: course.language,
      imageUrl: course.imageUrl,
      tags: course.tags,
    });
    this.showEdit = true;
  }

  closeEdit() {
    this.showEdit = false;
    this.selectedCourse = null;
    this.form.reset();
    this.submitting = false;
  }

  /** 💾 Запазва промените (PUT) */
  update() {
    if (!this.selectedCourse) return;
    if (this.form.invalid) return;

    const raw = this.form.value;

    const payload: Partial<Course> = {
      title: raw.title || undefined,
      categoryId: raw.categoryId ? Number(raw.categoryId) : undefined,
      shortDescription: raw.shortDescription || undefined,
      description: raw.description || undefined,
      level: raw.level || undefined,
      duration: raw.duration || undefined,
      language: raw.language || undefined,
      imageUrl: raw.imageUrl || undefined,
      tags: (raw.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .join(','),
    };

    this.submitting = true;
    this.courseService.update(this.selectedCourse.id, payload).subscribe({
      next: () => {
        this.toast.success('💾 Промените са запазени.');
        this.closeEdit();
        this.loadCourses();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('❌ Неуспешно обновяване.');
        this.submitting = false;
      },
    });
  }

  /** 🗑️ Изтриване на курс */
  /** 🗑️ Потвърждение и изтриване */
  remove(courseId: number) {
    const course = this.myCourses.find((c) => c.id === courseId);
    if (!course) return;

    this.confirmDelete(course.title || 'този курс', () => {
      this.courseService.delete(courseId).subscribe({
        next: () => {
          this.toast.success('🗑️ Курсът е изтрит успешно.');
          this.myCourses = this.myCourses.filter((c) => c.id !== courseId);
          this.filter();
        },
        error: () => this.toast.error('❌ Неуспешно изтриване.'),
      });
    });
  }

  /** ✨ Красив custom confirm popup */
  confirmDelete(title: string, onConfirm: () => void) {
    const overlay = document.createElement('div');
    overlay.classList.add('confirm-overlay');

    overlay.innerHTML = `
    <div class="confirm-modal">
      <h3>❗ Потвърди изтриване</h3>
      <p>Сигурни ли сте, че искате да изтриете <strong>"${title}"</strong>?</p>
      <div class="actions">
        <button class="btn ghost cancel-btn">Откажи</button>
        <button class="btn danger confirm-btn">Изтрий</button>
      </div>
    </div>
  `;

    document.body.appendChild(overlay);

    const cancelBtn = overlay.querySelector('.cancel-btn') as HTMLElement;
    const confirmBtn = overlay.querySelector('.confirm-btn') as HTMLElement;

    cancelBtn.addEventListener('click', () => overlay.remove());
    confirmBtn.addEventListener('click', () => {
      overlay.classList.add('closing');
      setTimeout(() => overlay.remove(), 150);
      onConfirm();
    });
  }
}
