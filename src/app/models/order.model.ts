/** ข้อมูล Order ที่ได้จาก API */
export interface Order {
  id: number;
  // Required fields ตาม Requirement
  title: string;
  description?: string;
  orderType: OrderType;
  // Core fields
  userId: number;
  userName: string;
  restaurantId: number;
  restaurantName: string;
  status: OrderStatus;
  cancelReason?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

/** รายการย่อยใน Order */
export interface OrderItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** DTO สำหรับสร้าง Order ใหม่ */
export interface CreateOrderDto {
  title?: string;        // optional — ถ้าไม่ส่งจะ auto-generate จากชื่อร้าน
  description?: string;  // หมายเหตุ/คำขอพิเศษ
  orderType?: string;    // Delivery | Dine-in | Takeout
  restaurantId: number;
  items: { menuItemId: number; quantity: number }[];
}

/** DTO สำหรับ cancel พร้อมเหตุผล */
export interface CancelOrderDto {
  reason: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
export type OrderType = 'Delivery' | 'Dine-in' | 'Takeout';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  Pending: 'รอดำเนินการ',
  Preparing: 'กำลังเตรียม',
  Ready: 'พร้อมเสิร์ฟ',
  Delivered: 'ส่งแล้ว',
  Cancelled: 'ยกเลิกแล้ว',
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  'Delivery': 'จัดส่ง',
  'Dine-in':  'ทานที่ร้าน',
  'Takeout':  'รับกลับบ้าน',
};
