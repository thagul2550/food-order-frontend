import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order, ORDER_STATUS_LABELS } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  statusLabels: Record<string, string> = ORDER_STATUS_LABELS;
  readonly statusSteps = ['Pending', 'Preparing', 'Ready', 'Delivered'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAll().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'โหลดคำสั่งซื้อไม่สำเร็จ'; this.loading = false; },
    });
  }

  statusSeverity(status: string): string {
    const map: Record<string, string> = {
      Pending: 'warn', Preparing: 'info', Ready: 'success',
      Delivered: 'secondary', Cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  currentStep(status: string): number {
    return this.statusSteps.indexOf(status);
  }

  stepIcon(step: string): string {
    const m: Record<string, string> = {
      Pending: 'pi pi-clock', Preparing: 'pi pi-cog',
      Ready: 'pi pi-check-circle', Delivered: 'pi pi-send',
    };
    return m[step] ?? 'pi pi-circle';
  }
}
