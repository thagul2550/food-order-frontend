import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSummary } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    CardModule, ButtonModule, ProgressBarModule,
    ProgressSpinnerModule, MessageModule, DividerModule, TagModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = false;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loading = true;
    this.dashboardService.getSummary().subscribe({
      next: (data) => { this.summary = data; this.loading = false; },
      error: () => { this.error = 'ไม่สามารถโหลด dashboard ได้'; this.loading = false; },
    });
  }

  barValue(count: number): number {
    if (!this.summary?.totalOrders) return 0;
    return Math.round((count / this.summary.totalOrders) * 100);
  }

  statCards() {
    if (!this.summary) return [];
    return [
      { label: 'ทั้งหมด',       value: this.summary.totalOrders,     icon: 'pi pi-shopping-cart', color: '#6366f1' },
      { label: 'รอดำเนินการ',   value: this.summary.pendingOrders,   icon: 'pi pi-clock',         color: '#f59e0b' },
      { label: 'กำลังเตรียม',   value: this.summary.preparingOrders, icon: 'pi pi-spin pi-cog',   color: '#3b82f6' },
      { label: 'พร้อมเสิร์ฟ',   value: this.summary.readyOrders,     icon: 'pi pi-check-circle',  color: '#10b981' },
      { label: 'ส่งแล้ว',       value: this.summary.deliveredOrders, icon: 'pi pi-send',          color: '#6b7280' },
      { label: 'ยกเลิก',        value: this.summary.cancelledOrders, icon: 'pi pi-times-circle',  color: '#ef4444' },
    ];
  }
}
