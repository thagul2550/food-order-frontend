import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant, RestaurantWithMenu } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly apiUrl = 'http://localhost:5000/api/restaurants';

  constructor(private http: HttpClient) {}

  /** ดูรายการร้านอาหารทั้งหมด */
  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl);
  }

  /** ดูร้านอาหารพร้อมเมนูทั้งหมด */
  getById(id: number): Observable<RestaurantWithMenu> {
    return this.http.get<RestaurantWithMenu>(`${this.apiUrl}/${id}`);
  }
}
