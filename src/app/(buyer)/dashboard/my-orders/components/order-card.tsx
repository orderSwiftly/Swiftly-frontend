'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';

interface Props {
  readonly order: Order;
  readonly currentUserId: string;
  readonly shippingLoading: string | null;
  readonly handleShipOrder: (orderId: string) => void;
}

export default function OrderCard({
  order,
  currentUserId,
  shippingLoading,
  handleShipOrder,
}: Props) {
  const router = useRouter();

  const isOwner = order.items?.some(
    (item) => item.productOwnerId === currentUserId
  );

  // --- SAFE TOTALS ---
  const safeTotalPrice =
    typeof order.totalPrice === 'number' ? order.totalPrice : 0;

  const shippingAddress = order.shippingAddress || {
    addressLine1: 'N/A',
    city: 'N/A',
    state: 'N/A',
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <p className="text-sm text-gray-400 sec-ff">
          <span className="font-medium text-white">Order ID:</span>{' '}
          {order._id ?? '—'}
        </p>
        <p className="text-sm font-semibold text-[var(--acc-clr)] capitalize sec-ff">
          {order.orderStatus ?? 'pending'}
        </p>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {order.items?.map((item, index) => {
          const price = typeof item.price === 'number' ? item.price : 0;
          const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
          const total = price * quantity;

          return (
            <div
              key={index}
              className="flex items-center gap-4 border border-white/10 bg-white/10 rounded-md p-3"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={item.productImg?.[0] || '/fallback.jpg'}
                  alt={item.title ?? 'Product'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--txt-clr)] pry-ff line-clamp-1">
                  {item.title ?? 'Untitled'}
                </p>
                <p className="text-xs text-gray-400 sec-ff mt-1">
                  ₦{price.toLocaleString()} × {quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--txt-clr)] sec-ff whitespace-nowrap">
                ₦{total.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Shipping Address */}
      <div className="flex items-start justify-between p-2">
        <p className="text-gray-400 sec-ff text-sm">
          Shipping to: {shippingAddress.addressLine1}, {shippingAddress.city},{' '}
          {shippingAddress.state}
        </p>
        <p className="text-sm font-bold text-[var(--acc-clr)] sec-ff">
          Total: ₦{safeTotalPrice.toLocaleString()}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center pt-2">
        <div className="flex items-center gap-4 justify-between w-full">
          <Link
            className="text-[var(--acc-clr)] sec-ff flex items-center gap-1 group"
            href={`/dashboard/my-orders/get-orders/${order._id}`}
          >
            <span className="hover:underline">View Order</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-150 group-hover:translate-x-1"
            />
          </Link>

          <div className="flex items-center gap-2">
            {order.orderStatus === 'confirmed' && isOwner && (
              <button
                onClick={() => handleShipOrder(order._id)}
                disabled={shippingLoading === order._id}
                className="text-[var(--bg-clr)] sec-ff flex items-center gap-1 group bg-[var(--acc-clr)] px-4 py-2 rounded-lg border border-[var(--acc-clr)] hover:bg-[var(--acc-clr)]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shippingLoading === order._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Shipping...</span>
                  </>
                ) : (
                  <>
                    <Truck size={16} />
                    <span>Ship Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {order.paymentStatus !== 'paid' && !isOwner && (
          <div>
            <button
              onClick={() => router.push(`/order/${order._id}/payment`)}
              className="bg-[var(--acc-clr)] !text-[var(--bg-clr)] font-semibold capitalize px-5 py-2 rounded-lg hover:opacity-90 sec-ff cursor-pointer transition"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}