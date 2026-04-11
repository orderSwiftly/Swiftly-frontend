// lib/checkout.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CheckoutAddress {
  addressId?: string;
  building?: string;
  room?: string;
}

export interface CheckoutOrderItem {
  productId: string;
  title: string;
  price: string;
  quantity: number;
  lineTotal: number;
  productOwnerId: string;
  productImg: string[];
}

export interface CheckoutOrder {
  _id: string;
  userId: string;
  store_id: string;
  reservation_group_id: string;
  reservation_expires_at: string;
  items: CheckoutOrderItem[];
  pricing: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  };
  shippingAddress: {
    building: string;
    room: string;
    institutionId: string;
  };
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface CheckoutResponse {
  status: string;
  message: string;
  data: {
    order: CheckoutOrder;
    orderId: string;
  };
}

export interface SavedAddress {
  _id: string;
  building: string;
  room: string;
}

export interface SaveAddressResponse {
  status: string;
  message: string;
  data: {
    address: SavedAddress;
  };
}

// Checkout a specific store
export async function checkoutStore(
  storeId: string,
  address: CheckoutAddress
): Promise<CheckoutResponse> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/order/checkout/${storeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });

  const data: CheckoutResponse = await res.json();

  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Checkout failed');
  }

  return data;
}

// Fetch saved addresses
export async function fetchSavedAddresses(): Promise<SavedAddress[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/user/address`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Failed to fetch addresses');
  }

  return data.data.address ?? [];
}

// Save a new address
export async function saveNewAddress(building: string, room: string): Promise<SaveAddressResponse> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/user/add-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ building, room }),
  });

  const data: SaveAddressResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to save address');
  }

  return data;
}

// Calculate totals for a specific store (including fees)
export async function calculateStoreTotals(subtotal: number) {
  // Import dynamically to avoid circular dependency
  const { default: calculateTotals } = await import('@/lib/cartTotals');
  return calculateTotals(subtotal);
}