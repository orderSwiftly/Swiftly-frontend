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
    // official
    room: string;
    building: string;
    // standard
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
  paymentConfirmedAt: string;
  seller_name: string;
  shippedAt: string;
}

export default async function getShippedOrders(): Promise<GetShippedOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/shipped-orders`, {
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
    console.error("Claim order error response:", err.response?.data);
    throw new Error(
      err.response?.data?.message || err.message || "Failed to claim order"
    );
  }
}

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

export async function getClaimedOrders(): Promise<GetShippedOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/claimed-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.orders as GetShippedOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch claimed orders"
    );
  }
}

export async function getCollectedOrders(): Promise<GetShippedOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/collected-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.orders as GetShippedOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch collected orders"
    );
  }
}

export async function getDeliveredOrders(): Promise<GetShippedOrder[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${apiUrl}/api/v1/rider/delivered-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.orders as GetShippedOrder[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch completed orders"
    );
  }
}