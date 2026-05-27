import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthUser, AuthResponse, LoginDto, RegisterDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  // Signal คือ reactive state — เมื่อค่าเปลี่ยน component ที่ใช้จะ re-render อัตโนมัติ
  private currentUser = signal<AuthUser | null>(null);

  // Readonly signals ให้ component อ่านได้แต่แก้ไขไม่ได้โดยตรง
  user = this.currentUser.asReadonly();

  // computed() คำนวณค่าใหม่ทุกครั้งที่ dependency signal เปลี่ยน
  isLoggedIn = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  isUser = computed(() => this.currentUser()?.role === 'User');

  constructor(private http: HttpClient, private router: Router) {
    // พยายาม restore session จาก localStorage เมื่อ app เริ่มต้น
    this.restoreSession();
  }

  /** Login แล้ว save token ลง localStorage */
  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(res => this.saveSession(res)) // tap = ทำ side effect โดยไม่เปลี่ยนค่าใน stream
    );
  }

  /** Register แล้ว login เลย */
  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  /** Logout — ล้าง token และ redirect ไป login */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null); // update signal
    this.router.navigate(['/login']);
  }

  /** อ่าน token จาก localStorage (ใช้ใน interceptor) */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** บันทึก session ลง localStorage และ update signal */
  private saveSession(res: AuthResponse): void {
    const user: AuthUser = {
      userId: res.userId,
      fullName: res.fullName,
      email: res.email,
      role: res.role as 'User' | 'Admin',
    };
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user); // trigger reactive update
  }

  /** อ่านข้อมูล user จาก localStorage เมื่อ refresh page */
  private restoreSession(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch {
        localStorage.clear(); // ถ้า parse ไม่ได้ ให้ล้างทิ้ง
      }
    }
  }
}
