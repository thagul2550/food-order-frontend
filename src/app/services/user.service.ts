import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  /** Admin: ดูรายชื่อ User ทั้งหมด (ใช้ใน dropdown) */
  getAll(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(this.apiUrl);
  }

  /** ดูข้อมูลตัวเอง */
  getMe(): Observable<UserSummary> {
    return this.http.get<UserSummary>(`${this.apiUrl}/me`);
  }
}
