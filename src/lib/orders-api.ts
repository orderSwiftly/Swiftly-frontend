import { Order } from '@/types/order';

export const fetchOrders = async (token: string): Promise<Order[]> => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${api_url}/api/v1/order/get-orders`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const data = await res.json();
  if (res.ok && data.status === 'success' && Array.isArray(data.data?.orders)) {
    return data.data.orders;
  }
  return [];
};
