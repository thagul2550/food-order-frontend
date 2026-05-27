import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor — แทรก JWT token ลงใน Header ทุก request โดยอัตโนมัติ
 * แทนที่จะต้องใส่ header เองทุก API call
 *
 * HttpInterceptorFn = functional interceptor (Angular 17+)
 * Pattern: req → (แปลง req) → next(req ที่แปลงแล้ว)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // ถ้ามี token ให้ clone request แล้วเพิ่ม Authorization header
  // ต้อง clone เพราะ HttpRequest เป็น immutable object
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq); // ส่ง request ที่มี token ไปต่อ
  }

  return next(req); // ไม่มี token ส่ง request ปกติ
};
