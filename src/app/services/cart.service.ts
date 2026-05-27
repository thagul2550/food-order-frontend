import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { MenuItem } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  // State ของตะกร้า — เก็บเป็น Signal เพื่อให้ reactive
  private items = signal<CartItem[]>([]);
  private restaurantId = signal<number | null>(null);
  private restaurantName = signal<string>('');

  // Public readonly — component อ่านได้อย่างเดียว
  cartItems = this.items.asReadonly();
  currentRestaurantId = this.restaurantId.asReadonly();
  currentRestaurantName = this.restaurantName.asReadonly();

  // computed — คำนวณอัตโนมัติเมื่อ items เปลี่ยน
  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.subtotal, 0)
  );

  isEmpty = computed(() => this.items().length === 0);

  /** เพิ่มเมนูลงตะกร้า — ถ้าสั่งจากร้านอื่นให้ถามก่อน */
  addItem(menuItem: MenuItem, restaurantId: number, restaurantNameStr: string): boolean {
    // ถ้าตะกร้ามีของจากร้านอื่นอยู่แล้ว ให้ return false เพื่อให้ caller แสดง confirm
    if (this.restaurantId() !== null && this.restaurantId() !== restaurantId) {
      return false;
    }

    // ตั้งค่า restaurant ถ้ายังไม่มี
    if (this.restaurantId() === null) {
      this.restaurantId.set(restaurantId);
      this.restaurantName.set(restaurantNameStr);
    }

    const existing = this.items().find(i => i.menuItemId === menuItem.id);
    if (existing) {
      // ถ้ามีอยู่แล้ว เพิ่ม quantity
      this.items.update(items =>
        items.map(i => i.menuItemId === menuItem.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
          : i
        )
      );
    } else {
      // เพิ่มรายการใหม่
      this.items.update(items => [...items, {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        subtotal: menuItem.price,
        restaurantId,
      }]);
    }
    return true;
  }

  /** ลด quantity — ถ้าเหลือ 0 จะลบออก */
  decreaseItem(menuItemId: number): void {
    const item = this.items().find(i => i.menuItemId === menuItemId);
    if (!item) return;

    if (item.quantity <= 1) {
      this.removeItem(menuItemId);
    } else {
      this.items.update(items =>
        items.map(i => i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity - 1, subtotal: (i.quantity - 1) * i.price }
          : i
        )
      );
    }
  }

  /** เพิ่ม quantity */
  increaseItem(menuItemId: number): void {
    this.items.update(items =>
      items.map(i => i.menuItemId === menuItemId
        ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
        : i
      )
    );
  }

  /** ลบรายการออกจากตะกร้า */
  removeItem(menuItemId: number): void {
    this.items.update(items => items.filter(i => i.menuItemId !== menuItemId));
    // ถ้าตะกร้าว่างแล้ว reset restaurant
    if (this.items().length === 0) this.clearRestaurant();
  }

  /** ล้างตะกร้าทั้งหมด */
  clearCart(): void {
    this.items.set([]);
    this.clearRestaurant();
  }

  /** นับ quantity ของเมนูชิ้นนั้นในตะกร้า */
  getQuantity(menuItemId: number): number {
    return this.items().find(i => i.menuItemId === menuItemId)?.quantity ?? 0;
  }

  private clearRestaurant(): void {
    this.restaurantId.set(null);
    this.restaurantName.set('');
  }
}
