import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // inject services ผ่าน constructor
  constructor(
    public auth: AuthService,   // public เพื่อให้ template ใช้ได้
    public cart: CartService,
  ) {}

  /** Initial ตัวอักษรแรกของชื่อ สำหรับ Avatar */
  get userInitial(): string {
    return this.auth.user()?.fullName?.[0]?.toUpperCase() ?? '?';
  }
}
