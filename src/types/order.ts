// src/types/order.ts

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
  productOwnerId?: string;
  lineTotal?: number;
  itemStatus?: string;
  shippedAt?: string;
}

export interface ShippingAddress {
  // institution address (shown in UI)
  building?: string;
  room?: string;
  institutionId?: string;
  // legacy standard address (ignored in UI)
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export interface RiderInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  pricing?: OrderPricing;
  totalPrice?: number;
  orderStatus:
    | "pending"
    | "confirmed"
    | "shipped"
    | "awaiting_verification"
    | "verified"
    | "collected"
    | "delivered"
    | "cancelled"
    | "returned"
    | string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
  canShip?: boolean;
  deliveryCode?: number;
  assigned_rider_id?: string;
  requested_at?: string;
  verified_at?: string;
  collected_at?: string;
  delivered_at?: string;
}