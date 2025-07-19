'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import { useRouter } from 'next/navigation';

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[]; // optional
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/get-orders`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setOrders(data.data.orders || []);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <PulseLoader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-[var(--txt-clr)] sec-ff">You have not placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-[var(--light-bg)] px-4 py-12 text-center max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-[var(--txt-clr)] sec-ff">Your Orders</h2>
      <section className="space-y-6">
        {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4"
        >
          {/* Order Info */}
          <div className="flex justify-between items-center">
            <span className="text-sm sec-ff text-gray-400">
              Order ID: <span className="font-medium">{order._id}</span>
            </span>
            <span className="text-sm font-semibold capitalize text-[var(--acc-clr)] sec-ff">
              {order.orderStatus}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-3 rounded-md bg-white/10 border border-white/10"
              >
                <div className="w-14 h-auto relative shrink-0">
                  <Image
                    src={item.productImg?.[0] || '/fallback.jpg'}
                    alt={item.title}
                    width={54}
                    height={54}
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium pry-ff text-[var(--txt-clr)] line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 sec-ff">
                    ₦{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>

                <div className="text-sm font-semibold text-[var(--txt-clr)] sec-ff whitespace-nowrap">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="pt-2 space-y-1">
            <p className="text-sm text-gray-400 sec-ff">
              Shipping: {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>

          <div className="text-right font-bold text-[var(--acc-clr)] sec-ff mt-2 flex items-center justify-between">
          {order.paymentStatus !== 'paid' && (
              <button
                onClick={() => {
                  if (!order._id) {
                    toast.error('Invalid order ID');
                    return;
                  }
                  router.push(`/order/${order._id}/payment`);
                }}
                className="bg-[var(--acc-clr)] text-[var(--bg-clr)] font-semibold capitalize px-4 py-2 cursor-pointer rounded-lg"
              >
                Checkout
              </button>
            )}

            Total: ₦{order.totalPrice.toLocaleString()}
          </div>
        </div>
      ))}
      </section>
    </div>
  );
}