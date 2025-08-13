import axios from "axios";

export async function EnterDeliveryCode(orderId: string, deliveryCode: string) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const api_url = process.env.NEXT_PUBLIC_API_URL;
        console.log(orderId)
        const res = await axios.post(
            `${api_url}/api/v1/order/confirm-delivery/${orderId}`,
            { deliveryCode },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res.data;
    } catch (error) {
        console.error("Error confirming delivery:", error);
        throw error; // rethrow if you want to handle it in the UI
    }
}
