import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isInvalid(field: string): boolean {
  const control = this.registerForm.get(field);
  return !!(control && control.invalid && (control.dirty || control.touched));
  }


  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // mark inputs as touched for UI feedback
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.authService.register({ username, email, password }).subscribe({
      next: () => this.router.navigate(['/courses']),
      error: (err) =>
        (this.errorMessage = err.error?.message || 'Registration failed')
    });
  }
}
