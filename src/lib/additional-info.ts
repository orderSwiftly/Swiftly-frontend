import axios from "axios";

export async function AdditionalInfo(formData: { phoneNumber?: string; photo?: File }) {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const data = new FormData();
    if (formData.phoneNumber) data.append("phoneNumber", formData.phoneNumber);
    if (formData.photo) data.append("photo", formData.photo);

    const res = await axios.patch(`${api_url}/api/v1/user/add-info`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data.user;
  } catch (err: unknown) {
    if (err instanceof Error) console.error("Additional Info error:", err.message);
    else console.error("Additional Info error:", err);
  }
}