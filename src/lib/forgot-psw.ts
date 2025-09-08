// src/lib/forgot-psw.ts
import axios from "axios";
import toast from "react-hot-toast";

export async function ForgotPsw(email: string) {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const res = await axios.post(`${api_url}/api/v1/auth/user/forgot-password`, {
      email,
    });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Signup error:", err.message);
      toast.error(err.message);
    } else if (typeof err === "string") {
      toast.error(err);
    } else {
      toast.error("Something went wrong");
    }
  }
}
