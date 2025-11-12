import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;

  form = this.fb.nonNullable.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.authService
      .login(this.form.getRawValue()) // ✅ direct call to AuthService
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.toast.success('✅ Успешен вход!');
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
          const msg = err.error?.message || 'Невалидни данни за вход.';
          this.toast.error(msg);
        },
      });
  }
}
