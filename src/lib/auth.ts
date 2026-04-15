// src/lib/auth.ts
import axios, { AxiosError } from "axios";
import type { User } from "@/stores/userStore";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupPayload {
  fullname: string;
  email: string;
  password: string;
}


export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await axios.post(
      `${apiUrl}/api/v1/auth/user/login`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = res.data;

    if (data.status !== "success") {
      throw new Error(data.message || "Login failed");
    }

    const token =
      data.token || data.data?.token || data.data?.user?.token;

    if (!token) throw new Error("No token received from server");

    const raw = data.data.user;

    const user: User = {
      ...raw,
      _id: raw._id,
      role: raw.role as User["role"],
      email: raw.email,
      ...(raw.name && !raw.fullname ? { fullname: raw.name } : {}),
    };

    return { token, user };
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ||
      (err instanceof Error ? err.message : "Login failed");
    throw new Error(message);
  }
}

export async function signupUser(payload: SignupPayload): Promise<void> {
  try {
    const res = await axios.post(
      `${apiUrl}/api/v1/auth/user/signup`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = res.data;

    if (!res.status.toString().startsWith("2")) {
      throw new Error(data?.message ?? "Something went wrong");
    }
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ||
      (err instanceof Error ? err.message : "Something went wrong");
    throw new Error(message);
  }
}

// forgot password and reset password functions
export interface ResetPswPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  try {
    const res = await axios.post(`${apiUrl}/api/v1/auth/user/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json"
        }
      });
    return res.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ||
      (err instanceof Error ? err.message : "Something went wrong");
    throw new Error(message);
  }
}

export async function resetPsw(payload: ResetPswPayload): Promise<void> {
  try {
    const res = await axios.patch(`${apiUrl}/api/v1/auth/user/reset-password`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      });
    return res.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ||
      (err instanceof Error ? err.message : "Something went wrong");
    throw new Error(message);
  }
}