import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard สำหรับ route ที่ต้อง Login ก่อน
 * CanActivateFn = functional guard (Angular 17+)
 * ถ้าไม่ได้ login จะ redirect ไปหน้า /login
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);  // inject() ใช้แทน constructor injection ใน functional context
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};
