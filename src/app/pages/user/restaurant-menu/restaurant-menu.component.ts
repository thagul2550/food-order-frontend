import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { CartService } from '../../../services/cart.service';
import { RestaurantWithMenu, MenuItem } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-menu.component.html',
})
export class RestaurantMenuComponent implements OnInit {
  restaurant: RestaurantWithMenu | null = null;
  loading = true;
  error = '';
  addedItem = ''; // ชื่อเมนูที่เพิ่งเพิ่ม แสดงแจ้งเตือนชั่วคราว

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    public cart: CartService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.restaurantService.getById(id).subscribe({
      next: (data) => { this.restaurant = data; this.loading = false; },
      error: () => { this.error = 'โหลดเมนูไม่สำเร็จ'; this.loading = false; },
    });
  }

  get groupedMenu(): Record<string, MenuItem[]> {
    if (!this.restaurant) return {};
    return this.restaurant.menuItems.reduce((acc, item) => {
      acc[item.category] = acc[item.category] ?? [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }

  get categories(): string[] {
    return Object.keys(this.groupedMenu);
  }

  addToCart(item: MenuItem): void {
    if (!this.restaurant) return;
    const added = this.cart.addItem(item, this.restaurant.id, this.restaurant.name);
    if (!added) {
      // ใช้ confirm() ของ browser แทน p-confirmdialog
      const ok = confirm(
        `ตะกร้ามีรายการจากร้าน "${this.cart.currentRestaurantName()}" อยู่แล้ว\n` +
        `ต้องการล้างตะกร้าและสั่งจากร้านนี้แทนหรือไม่?`
      );
      if (ok) {
        this.cart.clearCart();
        this.cart.addItem(item, this.restaurant!.id, this.restaurant!.name);
        this.showAdded(item.name);
      }
    } else {
      this.showAdded(item.name);
    }
  }

  private showAdded(name: string): void {
    this.addedItem = name;
    setTimeout(() => this.addedItem = '', 1500);
  }

  categoryIcon(cat: string): string {
    const m: Record<string, string> = {
      Main: 'pi-star', Soup: 'pi-circle', Appetizer: 'pi-sparkles',
      Drink: 'pi-wave-pulse', Dessert: 'pi-heart',
    };
    return 'pi ' + (m[cat] ?? 'pi-list');
  }
}
