export async function initPayment(orderId: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
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
            throw new Error(data.message || 'Payment initialization failed')
        }

        return data.data // includes authorization_url, reference, etc.
    }
    catch (error: unknown) {
        console.error('Payment initialization error:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Something went wrong while initializing payment');
        }
        throw new Error('Something went wrong while initializing payment');
    }
}