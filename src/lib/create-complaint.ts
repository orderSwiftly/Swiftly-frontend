// src/services/create-complaint.ts
import axios from "axios";

interface ComplaintData {
  subject: string;
  content: string;
  attachments?: File[]; // leave for later
}

export async function CreateComplaint(data: ComplaintData) {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");

    if (!api_url) throw new Error("API URL not configured");
    if (!token) throw new Error("User is not authenticated");

    const response = await axios.post(
      `${api_url}/api/v1/complaint/create`,
      data, // plain JSON body for now
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
}
