/** ข้อมูลร้านอาหาร (list view) */
export interface Restaurant {
  id: number;
  name: string;
  description: string;
  category: string;
  openTime: string;
  rating: number;
  isOpen: boolean;
  menuItemCount: number;
}

/** ข้อมูลร้านพร้อมเมนูทั้งหมด (detail view) */
export interface RestaurantWithMenu extends Restaurant {
  menuItems: MenuItem[];
}

/** เมนูอาหารแต่ละรายการ */
export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}
