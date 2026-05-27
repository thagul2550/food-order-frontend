/** รายการสินค้าในตะกร้า */
export interface CartItem {
  menuItemId: number;
  menuItemName: string;
  price: number;         // ราคาต่อหน่วย
  quantity: number;
  subtotal: number;      // price × quantity
  restaurantId: number;
}
