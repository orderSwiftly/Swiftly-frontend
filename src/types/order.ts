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

export interface Order {
  _id: string;
  items: OrderItem[];
  pricing?: OrderPricing;
  totalPrice?: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
  canShip?: boolean;
}