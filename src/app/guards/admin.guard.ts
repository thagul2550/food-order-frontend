import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard สำหรับ route ที่เฉพาะ Admin เท่านั้น
 * ถ้าไม่ใช่ Admin จะ redirect ไป /restaurants
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) return true;

  // Login แล้วแต่ไม่ใช่ Admin → ไปหน้าหลัก
  router.navigate(['/restaurants']);
  return false;
};
