import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Category,
  CategoryService,
} from 'src/app/core/services/category.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  showCreateModal = false;
  showEditModal = false;

  selectedCategory: Category | null = null;

  createForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  editForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Грешка при зареждане на категориите');
        this.loading = false;
      },
    });
  }

  // ---------------- CREATE ----------------
  openCreate() {
    this.showCreateModal = true;
  }

  closeCreate() {
    this.showCreateModal = false;
    this.createForm.reset();
  }

  createCategory() {
    if (this.createForm.invalid) return;

    const payload = {
      name: this.createForm.value.name ?? '',
      description: this.createForm.value.description ?? undefined,
    };

    this.categoryService.create(payload).subscribe({
      next: (cat) => {
        this.toast.success('Категорията е създадена успешно.');
        this.categories.push(cat);
        this.closeCreate();
      },
      error: (err) => {
        this.toast.error(err.error?.error || 'Грешка при създаване');
      },
    });
  }

  // ---------------- EDIT ----------------
  openEdit(category: Category) {
    this.selectedCategory = category;
    this.editForm.patchValue(category);
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.selectedCategory = null;
    this.editForm.reset();
  }

  saveEdit() {
    if (!this.selectedCategory || this.editForm.invalid) return;

    const payload = {
      name: this.editForm.value.name ?? '',
      description: this.editForm.value.description ?? undefined,
    };

    this.categoryService.update(this.selectedCategory.id, payload).subscribe({
      next: () => {
        this.toast.success('Промените са запазени.');

        Object.assign(this.selectedCategory!, payload);

        this.closeEdit();
      },
      error: (err) => {
        this.toast.error(err.error?.error || 'Грешка при редакция');
      },
    });
  }

  // ---------------- DELETE ----------------
  deleteCategory(category: Category) {
    if (!confirm(`Сигурни ли сте, че искате да изтриете "${category.name}"?`))
      return;

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.toast.success('Категорията е изтрита.');
        this.categories = this.categories.filter((c) => c.id !== category.id);
      },
      error: (err) => {
        this.toast.error(
          err.error?.error || 'Категорията не може да бъде изтрита.'
        );
      },
    });
  }
}
