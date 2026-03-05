// src/libs/seller.ts
import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface SellerProfile {
  seller: {
    _id: string;
    businessName: string;
    email: string;
    logo: string;
    location: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
      updated_at: string;
    } | null;
    accountNumber: string;
    bankCode: string;
    paystackRecipientCode: string;
    paystackSubaccountId: string;
    institution: {
      _id: string;
      name: string;
      logo: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  products: {
    _id: string;
    title: string;
    description: string;
    productImg: string[];
    price: number;
    stock: number;
    location: string;
    productStatus: string;
    createdAt: string;
    category: {
      _id: string;
      name: string;
      slug: string;
    };
    seller: { _id: string };
    averageRating: number;
  }[];
}

export async function fetchSellerProfile(): Promise<SellerProfile> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const coords = await new Promise<{ latitude: number; longitude: number } | null>(
      (resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
        );
      }
    );

    const response = await axios.get(`${apiUrl}/api/v1/user/seller-profile`, {
      headers: { Authorization: `Bearer ${token}` },
      params: coords ?? {},
    });

    return response.data.data as SellerProfile;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch seller profile"
    );
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}