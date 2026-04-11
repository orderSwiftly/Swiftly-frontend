// lib/payment.ts
export async function initPayment(orderId: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const res = await fetch(`${apiUrl}/api/v1/flutterwave/initialize/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await res.json();
        
        if (!res.ok) {
            // Check for subaccount-related errors
            if (res.status === 502 || data.message?.includes('subaccount')) {
                throw new Error('This store has not configured their payment settings yet. Please contact the store owner.');
            }
            if (data.message?.includes('expired')) {
                throw new Error('Your reservation has expired. Please go back to cart and try again.');
            }
            throw new Error(data.message || 'Payment initialization failed');
        }

        if (!data.data?.authorization_url) {
            throw new Error('Invalid payment response from server');
        }

        return data.data;
    }
    catch (error: unknown) {
        console.error('Payment initialization error:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Something went wrong while initializing payment');
        }
        throw new Error('Something went wrong while initializing payment');
    }
}