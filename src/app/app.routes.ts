import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

/**
 * Route configuration — กำหนดว่า URL ไหนไปแสดง component ไหน
 * canActivate = guard ที่ต้องผ่านก่อนเข้า route
 */
export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },

  // ─── Auth (ไม่ต้อง login) ──────────────────────────────
  { path: 'login',    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },

  // ─── User pages (ต้อง login) ──────────────────────────
  {
    path: 'restaurants',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user/restaurant-list/restaurant-list.component').then(m => m.RestaurantListComponent),
  },
  {
    path: 'restaurants/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user/restaurant-menu/restaurant-menu.component').then(m => m.RestaurantMenuComponent),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'my-orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
  },

  // ─── Order Form & List (Requirement routes) ──────────
  {
    path: 'order-form',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-form/order-form.component').then(m => m.OrderFormComponent),
  },
  {
    path: 'order-list',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-list/order-list.component').then(m => m.OrderListComponent),
  },

  // ─── Admin pages (ต้อง login + เป็น Admin) ───────────
  {
    path: 'admin/orders',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent),
  },

  // Fallback
  { path: '**', redirectTo: 'restaurants' },
];
