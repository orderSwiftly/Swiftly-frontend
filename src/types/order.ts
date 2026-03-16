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
  // institution address
  building?: string;
  room?: string;
  institutionId?: string;
  // standard address
  // addressLine1?: string;
  // city?: string;
  // state?: string;
  // postalCode?: string;
  // country?: string;
}

export interface OrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  pricing: OrderPricing;
  shippingAddress: ShippingAddress;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  confirmed?: boolean;
  escrowStatus?: string;
  paystackAccessCode?: string;
  paystackReference?: string;
  paymentConfirmedAt?: string;
  deliveryCode?: number;
  shippedAt?: string;
}