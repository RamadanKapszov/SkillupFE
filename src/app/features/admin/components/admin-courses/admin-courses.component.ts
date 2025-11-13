import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCoursesService, PagedResult } from './admin-courses.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss'],
})
export class AdminCoursesComponent implements OnInit {
  courses: any[] = [];
  q = '';
  page = 1;
  pageSize = 10;
  totalCount = 0;
  loading = false;

  selectedCourse: any = null;
  showEditModal = false;
  showDeleteModal = false;

  constructor(
    private adminCourses: AdminCoursesService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(page: number = 1) {
    this.loading = true;
    this.page = page;

    this.adminCourses
      .getPaged({
        page: this.page,
        pageSize: this.pageSize,
        q: this.q || undefined,
      })
      .subscribe({
        next: (res: PagedResult<any>) => {
          this.courses = res.items || [];
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => {
          this.toast.error('❌ Грешка при зареждане на курсове.');
          this.loading = false;
        },
      });
  }

  onSearchChange() {
    this.load(1);
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  prevPage() {
    if (this.page > 1) this.load(this.page - 1);
  }

  nextPage() {
    if (this.page < this.totalPages()) this.load(this.page + 1);
  }

  openEdit(course: any) {
    this.selectedCourse = { ...course };
    this.showEditModal = true;
  }

  saveEdit() {
    if (!this.selectedCourse) return;

    const payload: any = {
      title: this.selectedCourse.title,
      description: this.selectedCourse.description,
      shortDescription: this.selectedCourse.shortDescription,
      level: this.selectedCourse.level,
      duration: this.selectedCourse.duration,
      language: this.selectedCourse.language,
      categoryId: this.selectedCourse.categoryId,
      imageUrl: this.selectedCourse.imageUrl,
      prerequisites: this.selectedCourse.prerequisites,
      whatYouWillLearn: this.selectedCourse.whatYouWillLearn,
      whoIsFor: this.selectedCourse.whoIsFor,
      tags: this.selectedCourse.tags,
    };

    this.adminCourses.update(this.selectedCourse.id, payload).subscribe({
      next: () => {
        this.toast.success('💾 Промените по курса са запазени.');
        this.showEditModal = false;
        this.load(this.page);
      },
      error: () => this.toast.error('❌ Грешка при редакция на курс.'),
    });
  }

  openDelete(course: any) {
    this.selectedCourse = course;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.selectedCourse) return;

    this.adminCourses.delete(this.selectedCourse.id).subscribe({
      next: () => {
        this.toast.success('🗑️ Курсът е изтрит.');
        this.showDeleteModal = false;
        this.load(this.page);
      },
      error: () => this.toast.error('❌ Грешка при изтриване на курс.'),
    });
  }

  viewCourse(courseId: number) {
    this.router.navigate(['/courses', courseId]);
  }
}
