import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BadgeService, Badge } from 'src/app/core/services/badge.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-admin-badges',
  templateUrl: './admin-badges.component.html',
  styleUrls: ['./admin-badges.component.scss'],
})
export class AdminBadgesComponent implements OnInit {
  badges: Badge[] = [];
  loading = false;

  search = '';
  selectedBadge: Badge | null = null;

  showCreateModal = false;
  showEditModal = false;
  submitting = false;

  createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    conditionType: ['', Validators.required],
    threshold: [null as number | null],
    iconUrl: [''],
  });

  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    conditionType: ['', Validators.required],
    threshold: [null as number | null],
    iconUrl: [''],
  });

  constructor(
    private badgeService: BadgeService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBadges();
  }

  get filteredBadges(): Badge[] {
    const term = this.search.toLowerCase().trim();
    return this.badges.filter((b) => b.name.toLowerCase().includes(term));
  }

  loadBadges() {
    this.loading = true;
    this.badgeService.getAll().subscribe({
      next: (res) => {
        this.badges = res || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('❌ Грешка при зареждане на баджовете.');
        this.loading = false;
      },
    });
  }

  // CREATE
  openCreate() {
    this.createForm.reset({
      name: '',
      description: '',
      conditionType: '',
      threshold: null,
      iconUrl: '',
    });
    this.showCreateModal = true;
  }

  closeCreate() {
    this.showCreateModal = false;
    this.submitting = false;
  }

  createBadge() {
    if (this.createForm.invalid) return;

    const dto = this.createForm.value as Partial<Badge>;

    this.submitting = true;
    this.badgeService.create(dto).subscribe({
      next: (created) => {
        this.badges.push(created);
        this.toast.success('🏅 Баджът е създаден успешно.');
        this.closeCreate();
      },
      error: () => {
        this.toast.error('❌ Грешка при създаване на бадж.');
        this.submitting = false;
      },
    });
  }

  // EDIT
  openEdit(badge: Badge) {
    this.selectedBadge = badge;
    this.editForm.reset({
      name: badge.name,
      description: badge.description || '',
      conditionType: badge.conditionType || '',
      threshold: badge.threshold ?? null,
      iconUrl: badge.iconUrl || '',
    });
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.selectedBadge = null;
    this.submitting = false;
  }

  updateBadge() {
    if (!this.selectedBadge) return;
    if (this.editForm.invalid) return;

    const dto = this.editForm.value as Partial<Badge>;
    this.submitting = true;

    this.badgeService.update(this.selectedBadge.id, dto).subscribe({
      next: () => {
        Object.assign(this.selectedBadge!, dto);
        this.toast.success('💾 Промените са запазени.');
        this.closeEdit();
      },
      error: () => {
        this.toast.error('❌ Грешка при обновяване.');
        this.submitting = false;
      },
    });
  }

  // DELETE
  deleteBadge(badge: Badge) {
    const ok = window.confirm(
      `Сигурни ли сте, че искате да изтриете баджа "${badge.name}"?`
    );

    if (!ok) return;

    this.badgeService.delete(badge.id).subscribe({
      next: () => {
        this.badges = this.badges.filter((b) => b.id !== badge.id);
        this.toast.success('🗑️ Баджът беше изтрит.');
      },
      error: (err) => {
        if (err.error?.error) {
          this.toast.error(err.error.error);
        } else {
          this.toast.error('❌ Грешка при изтриване.');
        }
      },
    });
  }
}
