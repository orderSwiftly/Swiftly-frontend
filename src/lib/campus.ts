// src/lib/campus.ts

import axios from "axios";

export interface Institution {
    _id: string;
    name: string;
    logo: string; // usually logos are URLs, not File[] in API response
    address: {
        city: string;
        state: string;
        country: string;
    };
}

const api_url = process.env.NEXT_PUBLIC_API_URL;

// Fetch all campuses
export async function GetCampusList() {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`${api_url}/api/v1/institution/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error fetching campus list:", error);
        throw error;
    }
}

// Select a campus by its _id
export async function selectCampus(institutionId: string) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.patch(
            `${api_url}/api/v1/user/select-institution`,
            { institutionId }, // <-- send _id in the body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return res.data;
    } catch (error) {
        console.error("Error selecting campus:", error);
        throw error;
    }
}

// Fetch currently selected campus
export async function fetchCurrentInstitution() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${api_url}/api/v1/institution/current`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return res.data.data.institution;
    } catch (error) {
        console.error('Error fetching current institution:', error);
    }
}