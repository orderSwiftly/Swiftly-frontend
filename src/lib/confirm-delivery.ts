import axios from "axios";

interface EnhancedError extends Error {
    response?: unknown;
    status?: number;
}

export async function EnterDeliveryCode(orderId: string, deliveryCode: string) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const api_url = process.env.NEXT_PUBLIC_API_URL;
        
        // console.log('API call details:');
        // console.log('Order ID:', orderId);
        // console.log('Delivery Code:', deliveryCode);
        // console.log('API URL:', `${api_url}/api/v1/order/confirm-delivery/${orderId}`);
        
        const res = await axios.post(
            `${api_url}/api/v1/order/confirm-delivery/${orderId}`,
            { deliveryCode: deliveryCode.trim() }, // Ensure no extra whitespace
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return res.data;
        
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
            interface AxiosErrorLike {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            }
            const err = error as AxiosErrorLike;
            // Re-throw with more context
            const enhancedError: EnhancedError = new Error(
                err.response?.data?.message ||
                `Request failed with status ${err.response?.status}` ||
                err.message
            );
            // Preserve original error properties
            enhancedError.response = err.response;
            enhancedError.status = err.response?.status;
            throw enhancedError;
        } else if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}