// src/lib/rider-order.ts

import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface GetShippedOrder {
  _id: string;
  userId: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    lineTotal: number;
    productOwnerId: string;
    productImg: string[];
    itemStatus: string;
    shippedAt: string;
  }[];
  pricing: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  };
  shippingAddress: {
    // official (on-campus)
    room?: string;
    building?: string;
    // standard
    addressLine1?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderStatus: "shipped" | "awaiting_verification" | "verified" | "collected" | "delivered";
  paymentStatus: string;
  escrowStatus: "held" | "released" | "refunded";
  createdAt: string;
  paystackReference: string;
  confirmed: boolean;
  deliveryCode: number;
  paymentConfirmedAt: string;
  seller_name: string;
  shippedAt: string;
  // Rider assignment
  assigned_rider_id?: string;
  // Lifecycle timestamps
  requested_at?: string;
  verified_at?: string;
  collected_at?: string;
  delivered_at?: string;
}

export interface RiderProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

// ─── Browse available orders ───────────────────────────────────────────────

export default async function getShippedOrders(): Promise<GetShippedOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/orders/shipped`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data as GetShippedOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch shipped orders"
    );
  }
}

// ─── Request pickup (replaces claim) ──────────────────────────────────────

export async function requestOrder(orderId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${apiUrl}/api/v1/rider/request/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to request order"
    );
  }
}

// ─── Active orders (awaiting_verification → verified → collected) ──────────

export async function getActiveOrders(): Promise<GetShippedOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/orders/active`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const payload = response.data.data;
    return (Array.isArray(payload) ? payload : payload.orders ?? []) as GetShippedOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch active orders"
    );
  }
}

// ─── Collect from seller ───────────────────────────────────────────────────

export async function collectOrder(orderId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${apiUrl}/api/v1/rider/collect/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to collect order"
    );
  }
}

// ─── Deliver to buyer ──────────────────────────────────────────────────────

export async function deliverOrder(orderId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${apiUrl}/api/v1/rider/deliver/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to deliver order"
    );
  }
}

// ─── Buyer: accept / reject rider (called from buyer side) ───────────────

export async function acceptRider(orderId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${apiUrl}/api/v1/order/${orderId}/rider/accept`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to accept rider"
    );
  }
}

export async function rejectRider(orderId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${apiUrl}/api/v1/order/${orderId}/rider/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to reject rider"
    );
  }
}

// ─── Delivered orders (paginated) ─────────────────────────────────────────

export async function getDeliveredOrders(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<GetShippedOrder>> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(
      `${apiUrl}/api/v1/rider/orders/delivered?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const payload = response.data.data;
    const orders = Array.isArray(payload) ? payload : (payload.orders ?? []);
    const meta = payload.meta ?? response.data.meta ?? {
      total: orders.length,
      totalPages: 1,
      page,
      limit,
    };

    return { data: orders as GetShippedOrder[], meta };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch delivered orders"
    );
  }
}

// ─── Rider profile ─────────────────────────────────────────────────────────

export async function getRiderProfile(): Promise<RiderProfile> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data as RiderProfile;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch rider profile"
    );
  }
}