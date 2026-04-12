// src/components/riders/order-details.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  CreditCard, 
  Clock, 
  User, 
  Phone,
  Store,
  Calendar,
  CheckCircle
} from 'lucide-react';
import PulseLoader from '@/components/pulse-loader';

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  lineTotal: number;
  productImg?: string[];
}

interface Order {
  _id: string;
  items: OrderItem[];
    pricing: {
        subtotal: number;
        serviceFee: number;
        deliveryFee: number;
        total: number
    };
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  delivered_at?: string;
  shippingAddress: {
    building?: string; 
    room?: string;
    addressLine1?: string; 
    city?: string; 
    state?: string;
    institutionId?: string;
  };
  deliveryCode?: number;
  seller_name: string;
  buyer: {
    name: string;
    phone: string;
  };
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: 'rgba(234,179,8,0.12)', color: '#b45309', border: 'rgba(234,179,8,0.35)' },
  confirmed: { bg: 'rgba(59,130,246,0.10)', color: '#1d4ed8', border: 'rgba(59,130,246,0.3)' },
  shipped: { bg: 'rgba(168,85,247,0.10)', color: '#7e22ce', border: 'rgba(168,85,247,0.3)' },
  awaiting_verification: { bg: 'rgba(245,158,11,0.10)', color: '#b45309', border: 'rgba(245,158,11,0.3)' },
  verified: { bg: 'rgba(34,197,94,0.10)', color: '#166534', border: 'rgba(34,197,94,0.3)' },
  delivered: { bg: 'rgba(102,153,23,0.12)', color: '#669917', border: 'rgba(102,153,23,0.3)' },
  collected: { bg: 'rgba(102,153,23,0.12)', color: '#669917', border: 'rgba(102,153,23,0.3)' },
};

const imgUrl = (url: string) => url.replace('/upload/', '/upload/q_auto,f_auto,w_300/');

const card: React.CSSProperties = {
  backgroundColor: '#f6faf3',
  border: '1px solid rgba(0,107,79,0.1)',
  boxShadow: '0 2px 16px rgba(0,107,79,0.07)',
  borderRadius: '16px',
  padding: '16px',
};

export default function RiderOrderDetails() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/order/get-order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        setOrder(data.data.order);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[var(--txt-clr)]">
      <PulseLoader />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-[var(--txt-clr)] flex items-center justify-center px-6 text-center">
      <div className="space-y-3">
        <Package size={48} className="text-[var(--acc-clr)] mx-auto opacity-40" />
        <p className="text-lg text-[var(--pry-clr)] sec-ff">{error || 'Order not found.'}</p>
        <Link href="/rider/dashboard/orders" className="text-[var(--bg-clr)] sec-ff text-sm underline underline-offset-4">
          Back to orders
        </Link>
      </div>
    </div>
  );

  const shortId = `#${order._id.slice(-8).toUpperCase()}`;
  const ss = STATUS_STYLES[order.orderStatus] ?? { bg: 'rgba(10,15,26,0.06)', color: 'var(--pry-clr)', border: 'rgba(10,15,26,0.15)' };
  const addr = order.shippingAddress ?? {};
  const hasInstitution = addr.building || addr.room;
  const deliveryAddress = hasInstitution
    ? [addr.building, addr.room].filter(Boolean).join(', ')
    : [addr.addressLine1, addr.city, addr.state].filter(Boolean).join(', ') || 'N/A';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[var(--txt-clr)] pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-5">

        {/* Back button */}
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-[var(--bg-clr)] hover:text-[var(--acc-clr)] transition-colors sec-ff text-sm group"
        >
          <ArrowLeft size={15} className="transition-transform duration-150 group-hover:-translate-x-1" />
          Back to Orders
        </Link>

        {/* Title + badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-[var(--pry-clr)] pry-ff">Order Details</h1>
            <p className="text-xs sm:text-sm text-[var(--bg-clr)] sec-ff mt-0.5">{shortId}</p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border capitalize sec-ff shrink-0"
            style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}
          >
            {order.orderStatus.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Buyer Information */}
        <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2 mb-3">
            <User size={15} className="text-[var(--bg-clr)]" /> Buyer Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[var(--bg-clr)] opacity-60" />
              <span className="text-sm text-[var(--pry-clr)] sec-ff">
                <span className="opacity-60">Name:</span> {order.buyer.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[var(--bg-clr)] opacity-60" />
              <span className="text-sm text-[var(--pry-clr)] sec-ff">
                <span className="opacity-60">Phone:</span> {order.buyer.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2 mb-3">
            <Store size={15} className="text-[var(--bg-clr)]" /> Store Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Store size={14} className="text-[var(--bg-clr)] opacity-60" />
              <span className="text-sm text-[var(--pry-clr)] sec-ff">
                <span className="opacity-60">Store:</span> {order.seller_name}
              </span>
            </div>
            {order.deliveryCode && (
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[var(--bg-clr)] opacity-60" />
                <span className="text-sm text-[var(--pry-clr)] sec-ff">
                  <span className="opacity-60">Delivery Code:</span> <span className="font-mono font-bold">{order.deliveryCode}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Meta information */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={12} className="text-[var(--bg-clr)] shrink-0" />
              <span className="text-xs text-[var(--bg-clr)] sec-ff opacity-70">Order Placed</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[var(--pry-clr)] sec-ff">{formatDate(order.createdAt)}</p>
          </div>
          
          <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
            <div className="flex items-center gap-1 mb-1">
              <CreditCard size={12} className="text-[var(--bg-clr)] shrink-0" />
              <span className="text-xs text-[var(--bg-clr)] sec-ff opacity-70">Payment</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[var(--pry-clr)] sec-ff capitalize">{order.paymentStatus}</p>
          </div>

          {order.delivered_at && (
            <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
              <div className="flex items-center gap-1 mb-1">
                <Clock size={12} className="text-[var(--bg-clr)] shrink-0" />
                <span className="text-xs text-[var(--bg-clr)] sec-ff opacity-70">Delivered On</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[var(--pry-clr)] sec-ff">{formatDate(order.delivered_at)}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2">
            <Package size={15} className="text-[var(--bg-clr)]" /> Items ({order.items.length})
          </h2>
          {order.items.map((item, i) => (
            <div
              key={i}
              style={card}
              className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]"
            >
              <div className="flex gap-3">
                {/* Product image */}
                <div className="flex gap-2 shrink-0">
                  {(item.productImg?.slice(0, 2) ?? []).map((img, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0"
                      style={{ border: '1px solid rgba(0,107,79,0.12)' }}
                    >
                      <img
                        src={imgUrl(img)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  ))}
                  {!item.productImg?.length && (
                    <div
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,107,79,0.08)' }}
                    >
                      <Package size={24} className="text-[var(--bg-clr)] opacity-40" />
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <p className="text-sm font-bold text-[var(--pry-clr)] pry-ff line-clamp-2">{item.title}</p>
                  <p className="text-xs text-[var(--bg-clr)] sec-ff mt-0.5 opacity-80">
                    ₦{Number(item.price).toLocaleString()} × {item.quantity}
                  </p>
                </div>

                {/* Line total */}
                <p className="text-sm font-bold text-[var(--bg-clr)] sec-ff whitespace-nowrap self-start">
                  ₦{(Number(item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2 mb-2">
            <MapPin size={15} className="text-[var(--bg-clr)]" /> Delivery Address
          </h2>
          <p className="text-sm text-[var(--pry-clr)] sec-ff opacity-70">{deliveryAddress}</p>
        </div>

        {/* Pricing Summary */}
        <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2 mb-3">
            <CreditCard size={15} className="text-[var(--bg-clr)]" /> Pricing Summary
          </h2>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm sec-ff">
              <span className="text-[var(--pry-clr)] opacity-60">Subtotal</span>
              <span className="text-[var(--pry-clr)] font-medium">₦{order.pricing.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm sec-ff">
              <span className="text-[var(--pry-clr)] opacity-60">Delivery Fee</span>
              <span className="text-[var(--pry-clr)] font-medium">₦{order.pricing.deliveryFee.toLocaleString()}</span>
            </div>
            {order.pricing.serviceFee > 0 && (
              <div className="flex justify-between text-sm sec-ff">
                <span className="text-[var(--pry-clr)] opacity-60">Service Fee</span>
                <span className="text-[var(--pry-clr)] font-medium">₦{order.pricing.serviceFee.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div
            className="mt-3 pt-3 flex justify-between items-center"
            style={{ borderTop: '1px solid rgba(0,107,79,0.12)' }}
          >
            <span className="font-bold text-[var(--pry-clr)] pry-ff">Total</span>
            <span className="text-lg sm:text-xl font-bold text-[var(--bg-clr)] sec-ff">
              ₦{order.pricing.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}