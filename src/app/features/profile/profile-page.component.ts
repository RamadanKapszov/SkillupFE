import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [CommonModule],
})
export class ProfilePageComponent implements OnInit {
  user: any;
  loading = true;
  error = false;
  enrolledCourses: any[] = [];

  constructor(
    private profileService: ProfileService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('skillup.user');
    const currentUser = userData ? JSON.parse(userData) : null;

    if (currentUser?.id) {
      this.profileService.getDashboard(currentUser.id).subscribe({
        next: (res) => {
          this.user = res;
          this.loading = false;

          // ✅ записани курсове
          this.enrolledCourses = res.enrolledCourses || [];
        },
        error: () => {
          this.toast.error('❌ Грешка при зареждане на профила.');
          this.loading = false;
          this.error = true;
        },
      });
    }
  }
}
