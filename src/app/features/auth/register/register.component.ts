import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthHttpService } from 'src/app/core/services/auth-http.service';

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
    private authHttp: AuthHttpService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit() {
    console.log('Формата е:', this.form.value); // 👈 временно, за тест
    if (this.form.invalid) {
      console.warn('Формата е невалидна');
      return;
    }

    this.loading = true;
    this.authHttp
      .register(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.toast.success('Успешна регистрация!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Грешка при регистрация', err);
          const msg = err.error?.message || 'Регистрацията не бе успешна.';
          this.toast.error(msg);
        },
      });
  }
}
