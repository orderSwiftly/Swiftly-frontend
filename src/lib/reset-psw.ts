import axios from "axios";
import toast from "react-hot-toast";

export async function ResetPsw(email: string, otp: string, newPassword: string) {
    try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.patch(`${api_url}/api/v1/auth/user/reset-password`, {
            email,
            otp,
            newPassword
        })
        return response.data;
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