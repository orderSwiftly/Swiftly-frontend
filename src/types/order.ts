// src/types/order.ts
export interface OrderItem {
  productId: { $oid: string };
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
  productOwnerId?: { $oid: string };
  lineTotal?: number;
}

export interface ShippingAddress {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export interface Order {
  _id: { $oid: string };
  userId: { $oid: string };
  items: OrderItem[];
  pricing: OrderPricing;
  shippingAddress: ShippingAddress;
  orderStatus: string;
  paymentStatus: string;
  createdAt: { $date: string };
  confirmed: boolean;
  escrowStatus?: string;
  paystackAccessCode?: string;
  paystackReference?: string;
  paymentConfirmedAt?: { $date: string };
  deliveryCode?: number;

  // convenience fields after transformation
  total?: number;
  id?: string;
  created?: string;
}