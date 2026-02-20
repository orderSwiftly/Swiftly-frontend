// src/lib/ship.ts

import axios, { AxiosError } from "axios";

export async function ShipOrders(orderId: string) {
    try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        console.log('Attempting to ship order:', orderId);
        console.log('API URL:', `${api_url}/api/v1/order/${orderId}/ship-order`);

        // Fix: Pass headers in the config object, not request body
        const res = await axios.patch(
            `${api_url}/api/v1/order/${orderId}/ship-order`,
            {}, // Empty body since PATCH doesn't need data
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        console.log('Full response:', res);
        console.log('Response data:', res.data);
        console.log('Response status:', res.status);

        // Your backend returns: { status: 'success', message: 'Order shipped successfully', data: { result } }
        return res.data;
        
    } catch (error: unknown) {
        console.error('Error shipping order:', error);
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as AxiosError;
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
        }
        
        // Re-throw the error so the component can handle it
        throw error;
    }
}