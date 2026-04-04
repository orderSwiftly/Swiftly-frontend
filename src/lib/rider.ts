// src/lib/rider.ts

import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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