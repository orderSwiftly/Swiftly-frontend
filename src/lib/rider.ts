// src/lib/rider.ts

import axios, { AxiosError } from "axios";

export interface RecentPayout {
  reference: string;
  amount: number;
  date: string;
}
 
export interface EarningsData {
  totalEarnings: number;
  totalOrders: number;
  todayEarnings: number;
  todayOrders: number;
  recentPayouts: RecentPayout[];
}

export interface Bank {
  name: string;
  code: string;
}
 
export interface ResolvedAccount {
  account_name: string;
}
 
export interface AddBankPayload {
  account_number: string;
  bank_code: string;
  bank_name: string;
}
 
export interface AddBankResponse {
  account_name: string;
  bank_name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBanksList(): Promise<Bank[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/rider/bank/list`);
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message ?? "Failed to fetch banks");
  }
}
 
export async function resolveAccount(
  account_number: string,
  bank_code: string
): Promise<ResolvedAccount> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/rider/bank/resolve`, {
      params: { account_number, bank_code },
    });
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message ?? "Failed to resolve account");
  }
}
 
export async function addBankDetails(payload: AddBankPayload): Promise<AddBankResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/rider/bank/add`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message ?? "Failed to add bank details");
  }
}

export async function fetchRiderBankDetails() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/rider/bank/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message ?? "Failed to fetch bank details");
  }
}

export async function fetchRiderDetails() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/rider`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message ?? "Failed to fetch rider details");
  }
}

export async function getEarnings(): Promise<EarningsData> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/rider/earnings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message ?? "Failed to fetch earnings");
  }
}

export async function uploadProfile(file: File) {
  const formData = new FormData();
  formData.append('photo', file);

  const token = localStorage.getItem('token');
  const res = await axios.patch(`${API_BASE_URL}/api/v1/rider/add-photo`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}