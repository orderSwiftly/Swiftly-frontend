// src/libs/seller.ts
import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface SellerProfile {
  seller: {
    _id: string;
    businessName: string;
    email: string;
    logo: string;
    phoneNumber: string;
    seller_address: string;
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

    const response = await axios.get(`${apiUrl}/api/v1/user/seller-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("seller profile response:", response.data.data.seller);

    return response.data.data as SellerProfile;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch seller profile"
    );
  }
}