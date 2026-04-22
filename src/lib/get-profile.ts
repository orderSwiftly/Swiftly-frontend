// src/lib/get-profile.ts

import axios from "axios";

export async function GetProfile() {
    try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const res = await axios.get(`${api_url}/api/v1/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return res.data.data.user;  // ✅ Direct return, no mapping needed
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("GetProfile error:", err.message);
        } else if (typeof err === "string") {
            console.error("GetProfile error:", err);
        } else {
            console.error("GetProfile error:", "Something went wrong");
        }
        return null;
    }
}