import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [CommonModule, FormsModule, SharedModule],
})
export class ProfilePageComponent implements OnInit {
  user: any;
  loading = true;
  error = false;
  enrolledCourses: any[] = [];
  editData = { username: '', email: '', password: '' };

  constructor(
    private profileService: ProfileService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('skillup.user');
    const currentUser = userData ? JSON.parse(userData) : null;

    if (currentUser?.id) {
      this.profileService.getDashboard(currentUser.id).subscribe({
        next: (res) => {
          this.user = res;
          this.loading = false;
          this.enrolledCourses = res.enrolledCourses || [];
          this.editData.username = res.username;
          this.editData.email = res.email;
        },
        error: () => {
          this.toast.error('❌ Грешка при зареждане на профила.');
          this.loading = false;
          this.error = true;
        },
      });
    }
  }

  updateProfile() {
    this.profileService.updateProfile(this.editData).subscribe({
      next: () => this.toast.success('✅ Промените са запазени успешно!'),
      error: () => this.toast.error('❌ Неуспешна актуализация на профила.'),
    });
  }

  uploadAvatar(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.profileService.uploadAvatar(file).subscribe({
      next: () => this.toast.success('🖼️ Снимката е обновена успешно!'),
      error: () => this.toast.error('❌ Грешка при качване на снимка.'),
    });
  }

  openCourse(courseId: number) {
    this.router.navigate(['/courses', courseId]);
  }
}
