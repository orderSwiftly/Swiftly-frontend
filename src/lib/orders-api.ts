// src/lib/orders-api.ts
import { Order } from "@/types/order";

// src/lib/orders-api.ts

import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ─── Rate & Review Rider ───────────────────────────────────────────────────

export interface RateRiderPayload {
  rating: number;   // 1–5, max 1 decimal place
  review?: string;  // optional, max 500 chars
}

export interface RateRiderResponse {
  status: string;
  message: string;
  data: {
    average: number;
    count: number;
  };
}

export const rateRider = async (
  orderId: string,
  payload: RateRiderPayload
): Promise<RateRiderResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.post(
      `${apiUrl}/api/v1/rider/rate/order/${orderId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to submit rating"
    );
  }
};

// ─── Get Rider Ratings (public — no token needed) ─────────────────────────

export interface RiderRatingsResponse {
  status: string;
  data: {
    average: number;
    count: number;
  };
}

export const getRiderRatings = async (
  riderId: string
): Promise<RiderRatingsResponse> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/rider/${riderId}/ratings`
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch ratings"
    );
  }
};

// ─── Report Rider ──────────────────────────────────────────────────────────

export interface ReportRiderPayload {
  reason: string; // 10–500 chars, required
}

export interface ReportRiderResponse {
  status: string;
  message: string;
}

export const reportRider = async (
  orderId: string,
  payload: ReportRiderPayload
): Promise<ReportRiderResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.post(
      `${apiUrl}/api/v1/rider/report/order/${orderId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to submit report"
    );
  }
};

// --------------------- others ------------------------------

// General fetchOrders (you can still use it if needed)
export const fetchOrders = async (token: string): Promise<Order[]> => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${api_url}/api/v1/order/get-orders`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (res.ok && data.status === "success" && Array.isArray(data.data?.orders)) {
    return data.data.orders;
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
    return data.data.orders;
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
    return data.data.orders;
  }
  return [];
};