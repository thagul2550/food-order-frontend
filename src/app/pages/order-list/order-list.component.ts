import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order, ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

/**
 * OrderListComponent — แสดงรายการคำสั่งซื้อทั้งหมด
 * User: เห็นเฉพาะ Order ของตัวเอง
 * Admin: เห็น Order ทั้งหมด + ปุ่มลบ (DELETE /api/orders/{id})
 */
@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  deletingId: number | null = null;

  // toast
  toastMsg = '';
  toastType = 'success';

  statusLabels = ORDER_STATUS_LABELS;
  typeLabels   = ORDER_TYPE_LABELS;

  constructor(
    private orderService: OrderService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'โหลดคำสั่งซื้อไม่สำเร็จ'; this.loading = false; },
    });
  }

  /** Admin: ลบ Order ด้วย HTTP DELETE */
  deleteOrder(order: Order): void {
    if (!confirm(`ลบคำสั่งซื้อ #${order.id} "${order.title}" ?\nการลบจะเปลี่ยนสถานะเป็น Cancelled`))
      return;

    this.deletingId = order.id;
    this.orderService.delete(order.id).subscribe({
      next: (updated) => {
        this.orders = this.orders.map(o => o.id === updated.id ? updated : o);
        this.deletingId = null;
        this.showToast(`ลบ Order #${updated.id} สำเร็จ`);
      },
      error: () => {
        this.showToast('ลบไม่สำเร็จ', 'error');
        this.deletingId = null;
      },
    });
  }

  private showToast(msg: string, type = 'success'): void {
    this.toastMsg = msg; this.toastType = type;
    setTimeout(() => this.toastMsg = '', 3000);
  }

  statusSeverity(status: string): string {
    const map: Record<string, string> = {
      Pending: 'warn', Preparing: 'info', Ready: 'success',
      Delivered: 'secondary', Cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }
}
