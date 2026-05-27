import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Order, ORDER_STATUS_LABELS } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  statusLabels: Record<string, string> = ORDER_STATUS_LABELS;

  // toast แบบ inline
  toastMsg = '';
  toastType = 'success';

  // Cancel dialog
  showCancelDialog = false;
  selectedOrder: Order | null = null;
  cancelForm;
  cancelling = false;

  // Status dialog
  showStatusDialog = false;
  updatingStatus = false;
  newStatus = '';
  statusOptions = [
    { label: 'รอดำเนินการ', value: 'Pending' },
    { label: 'กำลังเตรียม', value: 'Preparing' },
    { label: 'พร้อมเสิร์ฟ', value: 'Ready' },
    { label: 'ส่งแล้ว', value: 'Delivered' },
  ];

  constructor(private orderService: OrderService, private fb: FormBuilder) {
    this.cancelForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'โหลดข้อมูลไม่สำเร็จ'; this.loading = false; },
    });
  }

  private showToast(msg: string, type = 'success'): void {
    this.toastMsg = msg;
    this.toastType = type;
    setTimeout(() => this.toastMsg = '', 3000);
  }

  openCancelDialog(order: Order): void {
    this.selectedOrder = order;
    this.cancelForm.reset();
    this.showCancelDialog = true;
  }

  confirmCancel(): void {
    if (this.cancelForm.invalid || !this.selectedOrder) return;
    this.cancelling = true;
    this.orderService.cancel(this.selectedOrder.id, { reason: this.cancelForm.value.reason! })
      .subscribe({
        next: (updated) => {
          this.orders = this.orders.map(o => o.id === updated.id ? updated : o);
          this.showCancelDialog = false;
          this.cancelling = false;
          this.showToast(`ยกเลิก Order #${updated.id} สำเร็จ`);
        },
        error: () => {
          this.showToast('ยกเลิกไม่สำเร็จ', 'error');
          this.cancelling = false;
        },
      });
  }

  openStatusDialog(order: Order): void {
    this.selectedOrder = order;
    this.newStatus = order.status;
    this.showStatusDialog = true;
  }

  confirmStatusChange(): void {
    if (!this.selectedOrder || !this.newStatus) return;
    this.updatingStatus = true;
    this.orderService.updateStatus(this.selectedOrder.id, this.newStatus).subscribe({
      next: (updated) => {
        this.orders = this.orders.map(o => o.id === updated.id ? updated : o);
        this.showStatusDialog = false;
        this.updatingStatus = false;
        this.showToast('อัปเดตสถานะสำเร็จ');
      },
      error: () => {
        this.showToast('อัปเดตไม่สำเร็จ', 'error');
        this.updatingStatus = false;
      },
    });
  }

  statusSeverity(status: string): string {
    const map: Record<string, string> = {
      Pending: 'warn', Preparing: 'info', Ready: 'success',
      Delivered: 'secondary', Cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  count(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  totalRevenue(): number {
    return this.orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalPrice, 0);
  }
}
