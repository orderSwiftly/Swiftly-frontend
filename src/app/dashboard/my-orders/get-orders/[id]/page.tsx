'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
  deliveryCode?: number;
  escrowStatus?: string;
}

export default function GetOrderById() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/order/get-order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setOrder(data.data.order);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--light-bg)]">
        <PulseLoader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-6 py-10 text-left">
        <p className="text-lg text-[var(--txt-clr)] sec-ff">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--light-bg)] px-4 max-w-5xl mx-auto space-y-8 pt-[20px] md:pl-48">
      {/* Back button */}
      <Link
        href="/dashboard/my-orders"
        className="text-[var(--acc-clr)] sec-ff flex items-center gap-1 group w-fit"
      >
        <ArrowLeft size={16} className="transition-transform duration-150 group-hover:-translate-x-1" />
        <span className="hover:underline">Back to Orders</span>
      </Link>

      {/* Order Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm text-gray-400 sec-ff">
              <span className="font-medium text-white">Order ID:</span> {order._id}
            </p>
            <p className="text-sm text-gray-400 sec-ff">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.deliveryCode && (
              <p className="text-sm text-gray-400 sec-ff">
                Delivery Code: <span className="text-white">{order.deliveryCode}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--acc-clr)] capitalize sec-ff">
              {order.orderStatus}
            </p>
            <p className="text-xs text-gray-400 sec-ff">Payment: {order.paymentStatus}</p>
            {order.escrowStatus && (
              <p className="text-xs text-gray-400 sec-ff">Escrow: {order.escrowStatus}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-5">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="border border-white/10 bg-white/10 rounded-lg p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Multiple images */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {item.productImg?.length ? (
                    item.productImg.map((img, idx) => (
                      <div key={idx} className="relative w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={img}
                          alt={`${item.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="relative w-28 h-28 rounded-md bg-gray-100" />
                  )}
                </div>

                {/* Product details */}
                <div className="flex-1">
                  <p className="text-base font-semibold text-[var(--txt-clr)] pry-ff">{item.title}</p>
                  <p className="text-sm text-gray-400 sec-ff mt-1">
                    Unit Price: ₦{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 sec-ff">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-bold text-[var(--txt-clr)] mt-2">
                    Total: ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[var(--txt-clr)] pry-ff mb-3">Shipping Address</h3>
          <p className="text-sm text-gray-300 sec-ff">{order.shippingAddress.addressLine1}</p>
          <p className="text-sm text-gray-300 sec-ff">
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          <p className="text-sm text-gray-300 sec-ff">
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <p className="text-lg font-bold text-[var(--acc-clr)] sec-ff">
            Total: ₦{order.totalPrice.toLocaleString()}
          </p>
          {order.paymentStatus !== 'paid' && (
            <Link
              href={`/order/${order._id}/payment`}
              className="bg-[var(--acc-clr)] text-[var(--bg-clr)] font-semibold capitalize px-5 py-2 rounded-lg hover:opacity-90 sec-ff cursor-pointer transition"
            >
              Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}