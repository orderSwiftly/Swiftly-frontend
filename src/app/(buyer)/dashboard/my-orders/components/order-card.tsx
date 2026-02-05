// src/app/(buyer)/dashboard/my-orders/components/order-card.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck, Trash2 } from 'lucide-react';
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
  const computedTotalPrice = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return sum + price * quantity;
    }, 0)
    : 0;

  const safeTotalPrice =
    typeof order.totalPrice === 'number' && order.totalPrice > 0
      ? order.totalPrice
      : computedTotalPrice;


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
              className="flex items-center gap-4 border border-white/10 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              {/* Product Image */}
              <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <Image
                  src={item.productImg?.[0] || '/fallback.jpg'}
                  alt={item.title ?? 'Product'}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white pry-ff line-clamp-2 mb-2">
                  {item.title ?? 'Untitled'}
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 sec-ff">
                    ₦{price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">×</span>
                  <span className="text-gray-300 sec-ff font-medium">
                    Qty: {quantity}
                  </span>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-white sec-ff whitespace-nowrap">
                  ₦{total.toLocaleString()}
                </p>
                <button
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping Address & Total */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
        <div>
          <p className="text-xs text-gray-500 sec-ff mb-1">Shipping to:</p>
          <p className="text-sm text-gray-300 sec-ff">
            {shippingAddress.addressLine1}, {shippingAddress.city},{' '}
            {shippingAddress.state}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 sec-ff mb-1">Order Total</p>
          <p className="text-xl font-bold text-[var(--acc-clr)] sec-ff">
            ₦{safeTotalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 gap-4">
        <Link
          className="text-[var(--acc-clr)] sec-ff flex items-center gap-1 group hover:gap-2 transition-all"
          href={`/dashboard/my-orders/get-orders/${order._id}`}
        >
          <span className="hover:underline">View Order Details</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-150"
          />
        </Link>

        <div className="flex items-center gap-3">
          {order.orderStatus === 'confirmed' && isOwner && (
            <button
              onClick={() => handleShipOrder(order._id)}
              disabled={shippingLoading === order._id}
              className="text-white sec-ff flex items-center gap-2 bg-[var(--acc-clr)] px-5 py-2.5 rounded-lg hover:bg-[var(--acc-clr)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {shippingLoading === order._id ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Shipping...</span>
                </>
              ) : (
                <>
                  <Truck size={18} />
                  <span>Ship Order</span>
                </>
              )}
            </button>
          )}

          {order.paymentStatus !== 'paid' && !isOwner && (
            <button
              onClick={() => router.push(`/order/${order._id}/payment`)}
              className="bg-[var(--acc-clr)] text-white font-semibold capitalize px-6 py-2.5 rounded-lg hover:bg-[var(--acc-clr)]/90 sec-ff cursor-pointer transition-all"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}