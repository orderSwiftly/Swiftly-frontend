'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import { useRouter } from 'next/navigation';

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
}

interface ShippingAddress {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export default function GetOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${api_url}/api/v1/order/get-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.status === 'success') {
      const fetchedOrders = Array.isArray(data.data?.orders) ? data.data.orders : [];

      setOrders(fetchedOrders);
    } else {
      // If no orders array or response has failed
      setOrders([]); // fallback to empty list to avoid crashing
      console.warn('Orders not found or failed response:', data.message || 'Unknown error');
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    setOrders([]); // fallback to empty
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--light-bg)]">
        <PulseLoader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 py-10 text-left">
        <p className="text-lg text-[var(--txt-clr)] sec-ff">
          You have not placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--light-bg)] px-4 py-12 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-[var(--txt-clr)] sec-ff">Your Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <p className="text-sm text-gray-400 sec-ff">
              <span className="font-medium text-white">Order ID:</span> {order._id}
            </p>
            <p className="text-sm font-semibold text-[var(--acc-clr)] capitalize sec-ff">
              {order.orderStatus}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border border-white/10 bg-white/10 rounded-md p-3"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-md bg-gray-100">
  <Image
    src={item.productImg?.[0] || '/fallback.jpg'}
    alt={item.title}
    fill
    className="object-cover"
  />
</div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--txt-clr)] pry-ff line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 sec-ff mt-1">
                    ₦{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-bold text-[var(--txt-clr)] sec-ff whitespace-nowrap">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="text-sm text-gray-400 sec-ff">
            Shipping to: {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.state}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <p className="text-lg font-bold text-[var(--acc-clr)] sec-ff">
              Total: ₦{order.totalPrice.toLocaleString()}
            </p>

            {order.paymentStatus !== 'paid' && (
              <button
                onClick={() => router.push(`/order/${order._id}/payment`)}
                className="bg-[var(--acc-clr)] text-[var(--bg-clr)] font-semibold capitalize px-5 py-2 rounded-lg hover:opacity-90 sec-ff cursor-pointer transition"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
