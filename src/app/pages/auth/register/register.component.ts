import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';

    const v = this.form.value;
    this.auth.register({
      fullName: v.fullName!,
      email: v.email!,
      password: v.password!,
      role: v.role!,
    }).subscribe({
      next: (res) => {
        this.router.navigate(res.role === 'Admin' ? ['/admin/orders'] : ['/restaurants']);
      },
      error: (err) => {
        this.error = err.error || 'สมัครสมาชิกไม่สำเร็จ';
        this.loading = false;
      },
    });
  }

  setRole(role: string) {
    this.form.get('role')?.setValue(role);
  }

  isInvalid(field: string) {
    const c = this.form.get(field);
    return c?.invalid && c?.touched;
  }
}
