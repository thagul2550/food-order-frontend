import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, CancelOrderDto } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  /** ดู Order ทั้งหมด (User: เฉพาะของตัวเอง, Admin: ทั้งหมด) */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  /** สร้าง Order ใหม่จากตะกร้า */
  create(dto: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, dto);
  }

  /** Admin: Cancel Order พร้อมเหตุผล */
  cancel(id: number, dto: CancelOrderDto): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, dto);
  }

  /** Admin: เปลี่ยน status ของ Order */
  updateStatus(id: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /** Admin: ลบ Order (soft-delete via HTTP DELETE) */
  delete(id: number): Observable<Order> {
    return this.http.delete<Order>(`${this.apiUrl}/${id}`);
  }
}
