export interface DashboardSummary {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  ordersByType: TypeCount[];
}

export interface TypeCount {
  type: string;
  count: number;
}
