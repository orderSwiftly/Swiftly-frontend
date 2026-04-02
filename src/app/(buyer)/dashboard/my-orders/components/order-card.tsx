// src/app/(buyer)/dashboard/my-orders/components/order-card.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import OrderProgress from './order-progress';
import { ORDER_PROGRESS_MAP, ORDER_STATUS_LABEL } from '@/lib/order-progress';

interface Props {
  readonly order: Order;
  readonly currentUserId: string;
  readonly shippingLoading: string | null;
  readonly handleShipOrder: (orderId: string) => void;
}

export default function OrderCard({ order, currentUserId, shippingLoading, handleShipOrder }: Props) {
  const router = useRouter();

  const isOwner = order.items?.some(item => item.productOwnerId === currentUserId);

  const { building, room } = order.shippingAddress ?? {};
  const shippingLabel = building || room
    ? [building, room].filter(Boolean).join(', ')
    : null;

  const orderTotal = order.pricing?.total ?? order.totalPrice ?? 0;
  const shortId = order._id ? `#${order._id.slice(-8).toUpperCase()}` : '—';

  // Resolve progress step; unknown statuses fall back to -1 (all dots unfilled)
  const progressStep = ORDER_PROGRESS_MAP[order.orderStatus] ?? -1;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <p className="text-sm text-gray-400 sec-ff">
          <span className="font-medium text-[var(--sec-clr)]">Order ID:</span> {shortId}
        </p>
        <p className="text-sm text-gray-400 sec-ff">
          <span className="font-medium text-[var(--sec-clr)]">Placed on:</span> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
              <p className="text-sm font-semibold text-[var(--pry-clr)] pry-ff line-clamp-1">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 sec-ff mt-1">
                ₦{item.price.toLocaleString()} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-[var(--pry-clr)] sec-ff whitespace-nowrap">
              ₦{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping Address & Total */}
      <div className="flex items-start justify-between p-2">
        <p className="text-gray-400 sec-ff text-sm">
          {shippingLabel ? `Shipping to: ${shippingLabel}` : 'Shipping address unavailable'}
        </p>
        <p className="text-sm font-bold text-[var(--prof-clr)] sec-ff">
          Total: ₦{orderTotal.toLocaleString()}
        </p>
      </div>

            {/* Progress bar */}
      <OrderProgress filled={progressStep} />
      <p className="text-sm font-semibold text-[var(--pry-clr)] sec-ff text-center">
        {ORDER_STATUS_LABEL[order.orderStatus] ?? `Your order is ${order.orderStatus.replace(/_/g, ' ')}`}
      </p>


      {/* Footer */}
      <div className="flex items-center pt-2">
        <div className="flex items-center gap-4 justify-between w-full">
          <Link
            className="text-[var(--acc-clr)] sec-ff flex items-center gap-1 group"
            href={`/dashboard/my-orders/get-orders/${order._id}`}
          >
            <span className="hover:underline">View Order</span>
            <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
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