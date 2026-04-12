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

// verify Payment
export interface Pricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export interface OrderData {
  _id?: string;
  pricing?: Pricing;
  deliveryCode?: string;
  createdAt?: string;
  store_name: string;
  paymentMethod?: string;
  transactionReference?: string;
  delivery_window?: {
    start: string;
    end: string;
  };
}

export interface VerifyPaymentResponse {
  status: string;
  message: string;
  data?: {
    order: {
      _id: string;
      pricing: Pricing;
      deliveryCode?: string;
      createdAt: string;
      store_name?: string;
      delivery_window?: {
        start: string;
        end: string;
      };
    };
  };
}

export async function verifyPayment(reference: string): Promise<{
  success: boolean;
  message: string;
  orderData?: OrderData;
  statusCode?: number;
}> {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('token');
    
    console.log('Verifying payment with reference:', reference);
    
    const res = await fetch(`${api_url}/api/v1/flutterwave/verify?reference=${reference}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    const data: VerifyPaymentResponse = await res.json();
    console.log('Verification response:', { status: res.status, data });
    
    if (res.ok && data.status === 'success') {
      return {
        success: true,
        message: data.message || 'Payment confirmed successfully!',
        orderData: {
          _id: data.data?.order?._id,
          pricing: data.data?.order?.pricing,
          deliveryCode: data.data?.order?.deliveryCode,
          createdAt: data.data?.order?.createdAt,
          store_name: data.data?.order?.store_name || 'Swiftly Store',
          paymentMethod: 'Card Payment',
          transactionReference: reference,
          delivery_window: data.data?.order?.delivery_window ? {
            start: data.data.order.delivery_window.start,
            end: data.data.order.delivery_window.end,
          } : undefined,
        },
        statusCode: res.status,
      };
    } else if (res.status === 404) {
      return {
        success: false,
        message: 'Order not found. Please contact support with your payment reference.',
        statusCode: res.status,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Payment verification failed. Please contact support.',
        statusCode: res.status,
      };
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    return {
      success: false,
      message: 'Network error occurred while verifying payment. Please check your connection and try again.',
    };
  }
}