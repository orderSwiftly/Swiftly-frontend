// src/lib/orders-api.ts
import { Order } from "@/types/order";

const mapOrder = (order: Order) => ({
  ...order,
  total: order.pricing?.total ?? 0,
  id: order._id.$oid,
  created: order.createdAt.$date,
});

// General fetchOrders (you can still use it if needed)
export const fetchOrders = async (token: string): Promise<Order[]> => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${api_url}/api/v1/order/get-orders`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (res.ok && data.status === "success" && Array.isArray(data.data?.orders)) {
    return data.data.orders.map(mapOrder);
  }
  return [];
};

// Fetch only buyer orders
export const fetchBuyerOrders = async (token: string): Promise<Order[]> => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${api_url}/api/v1/order/get-buyer-orders`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (res.ok && data.status === "success" && Array.isArray(data.data?.orders)) {
    return data.data.orders.map(mapOrder);
  }
  return [];
};

// Fetch only seller orders
export const fetchSellerOrders = async (token: string): Promise<Order[]> => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${api_url}/api/v1/order/get-seller-orders`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (res.ok && data.status === "success" && Array.isArray(data.data?.orders)) {
    return data.data.orders.map(mapOrder);
  }
  return [];
};