const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CheckoutAddress {
  addressId?: string;
  building?: string;
  room?: string;
  isExpressDelivery?: boolean;
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

export interface StoreTotals {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export async function calculateStoreTotals(
  storeId: string,
  isExpressDelivery: boolean = false
): Promise<StoreTotals> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/order/calculate-totals/${storeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isExpressDelivery }),
  });

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Failed to calculate totals');
  }

  return data.data.pricing as StoreTotals;
}

export async function checkoutStore(
  storeId: string,
  address: CheckoutAddress
): Promise<{ authorization_url: string }> {
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

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    const err = new Error(data.message || 'Checkout failed') as Error & {
      response?: { data: typeof data };
    };
    err.response = { data };
    throw err;
  }

  if (!data.data?.authorization_url) {
    throw new Error('Invalid response from server');
  }

  return data.data;
}

export async function fetchSavedAddresses(institutionEnum: string): Promise<SavedAddress[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/user/address/${institutionEnum}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Failed to fetch addresses');
  }

  return data.data.address ?? [];
}

export async function saveNewAddress(
  building: string,
  room: string,
  institutionEnum: string
): Promise<SaveAddressResponse> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/user/add-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ building, room, institutionEnum }),
  });

  const data: SaveAddressResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to save address');
  }

  return data;
}