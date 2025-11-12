import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  loading = false;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  submit() {
    if (this.form.invalid) {
      this.toast.error('Моля, попълнете всички полета коректно.');
      return;
    }

    this.loading = true;
    this.authService
      .register(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.toast.success('✅ Регистрацията е успешна!');
          const role = this.authService.userRole;
          if (role === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'Teacher') {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('❌ Грешка при регистрация:', err);
          const msg = err.error?.message || 'Регистрацията не бе успешна.';
          this.toast.error(msg);
        },
      });
  }
}
