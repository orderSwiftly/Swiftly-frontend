// src/lib/rider-order.ts
import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface SellerLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  updated_at: string;
}

export interface NearbyOrder {
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
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  paystackReference: string;
  confirmed: boolean;
  deliveryCode: number;
  escrowStatus: string;
  paymentConfirmedAt: string;
  seller_location: SellerLocation;
  shippedAt: string;
}

export default async function nearbyOrders(): Promise<NearbyOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const coords = await new Promise<{ lat: number; lon: number } | null>(
      (resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
        );
      }
    );

    if (!coords) throw new Error("Unable to get your location");

    const response = await axios.get(`${apiUrl}/api/v1/rider/nearby-orders`, {
      headers: { Authorization: `Bearer ${token}` },
      params: coords,
    });

    return response.data.data as NearbyOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch nearby orders"
    );
  }
}

export async function claimOrder(orderId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${apiUrl}/api/v1/rider/claim/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to claim order"
    );
  }
}

// after claiming
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

export async function getClaimedOrders(): Promise<NearbyOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/claimed-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.orders as NearbyOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch claimed orders"
    );
  }
}

export async function getCollectedOrders(): Promise<NearbyOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/collected-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.orders as NearbyOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch collected orders"
    );
  }
}

// retrieve delivered orders/ completed orders
export async function getDeliveredOrders(): Promise<NearbyOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/completed-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.orders as NearbyOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch completed orders"
    );
  }
}