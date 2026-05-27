import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { ORDER_TYPE_LABELS } from '../../../models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  submitting = false;
  successMsg = '';
  errorMsg = '';

  readonly typeLabels = ORDER_TYPE_LABELS;

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {}

  /** อ่าน pending order metadata (title/description/orderType) จาก localStorage
   *  ที่ OrderFormComponent บันทึกไว้ก่อนมาเลือกเมนู */
  get pendingMeta(): { title?: string; description?: string; orderType?: string } | null {
    const raw = localStorage.getItem('pendingOrderMeta');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  placeOrder(): void {
    if (this.cart.isEmpty()) return;
    this.submitting = true;
    this.errorMsg = '';

    const meta = this.pendingMeta;

    const dto = {
      // ดึง title/description/orderType จาก pendingOrderMeta (ถ้ามี)
      title:       meta?.title       || undefined,
      description: meta?.description || undefined,
      orderType:   meta?.orderType   || 'Delivery',
      restaurantId: this.cart.currentRestaurantId()!,
      items: this.cart.cartItems().map(i => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      })),
    };

    this.orderService.create(dto).subscribe({
      next: () => {
        this.cart.clearCart();
        // ล้าง pending meta หลังสั่งสำเร็จ
        localStorage.removeItem('pendingOrderMeta');
        this.successMsg = 'สั่งอาหารสำเร็จ! กำลังนำไปหน้าคำสั่งซื้อ...';
        setTimeout(() => this.router.navigate(['/order-list']), 2000);
      },
      error: (err) => {
        this.errorMsg = err.error || 'ไม่สามารถสั่งอาหารได้';
        this.submitting = false;
      },
    });
  }
}
