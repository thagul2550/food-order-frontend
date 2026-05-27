import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

/**
 * OrderFormComponent — หน้าสร้างคำสั่งซื้อใหม่
 * User เลือกร้าน, ใส่ชื่อ Order (Title), หมายเหตุ (Description), และประเภท (OrderType)
 * แล้วกด "เลือกเมนู" → ไปหน้า Restaurant Menu เพื่อเพิ่มรายการอาหาร
 *
 * ข้อมูล title/description/orderType ถูกเก็บใน localStorage ชั่วคราว
 * CartComponent จะดึงไปแนบตอน checkout (POST /api/orders)
 */
@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-form.component.html',
})
export class OrderFormComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = true;

  // ตัวเลือก OrderType — ตรงกับ Type/Priority ใน Requirement
  readonly orderTypes = [
    { value: 'Delivery', label: '🛵 จัดส่ง (Delivery)' },
    { value: 'Dine-in',  label: '🍽️ ทานที่ร้าน (Dine-in)' },
    { value: 'Takeout',  label: '🥡 รับกลับบ้าน (Takeout)' },
  ];

  form;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      restaurantId: [null as number | null, Validators.required],
      title:        ['', [Validators.required, Validators.minLength(3)]],
      description:  [''],
      orderType:    ['Delivery', Validators.required],
    });
  }

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe({
      next: (data) => { this.restaurants = data.filter(r => r.isOpen); this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  /** เมื่อเลือกร้าน — auto-fill Title ด้วยชื่อร้าน (ถ้ายังว่างอยู่) */
  onRestaurantChange(): void {
    const id = Number(this.form.value.restaurantId);
    const r = this.restaurants.find(x => x.id === id);
    if (r && !this.form.value.title?.trim()) {
      this.form.patchValue({ title: `สั่งจาก ${r.name}` });
    }
  }

  /** บันทึก Order meta ลง localStorage แล้วไปเลือกเมนู */
  goToMenu(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const { restaurantId, title, description, orderType } = this.form.value;

    // CartComponent จะอ่าน key นี้ตอน checkout
    localStorage.setItem('pendingOrderMeta', JSON.stringify({
      title: title?.trim() || '',
      description: description?.trim() || null,
      orderType: orderType || 'Delivery',
    }));

    this.router.navigate(['/restaurants', restaurantId]);
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
