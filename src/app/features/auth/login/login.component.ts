import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthHttpService } from 'src/app/core/services/auth-http.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;

  // 👇 Here’s where you place it
  form = this.fb.nonNullable.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authHttp: AuthHttpService,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.authHttp
      .login(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          // ✅ 1. Запази токена
          this.authService.setToken(response.token);

          // ✅ 2. Изведи съобщение
          this.toast.success('Успешен вход!');

          // ✅ 3. Вземи ролята на текущия потребител
          const role = this.authService.userRole;

          // ✅ 4. Навигирай според роля
          if (role === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'Teacher') {
            this.router.navigate(['/courses/manage']);
          } else {
            this.router.navigate(['/categories']);
          }
        },
        error: (err) => {
          const msg = err.error?.message || 'Невалидни данни за вход.';
          this.toast.error(msg);
        },
      });
  }
}
