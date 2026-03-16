// src/app/(buyer)/dashboard/my-orders/get-orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, MapPin, Package, CreditCard, Tag, Clock } from 'lucide-react';
import ConfirmDelivery from './confirm-delivery';

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  lineTotal: number;
  productImg?: string[];
  itemStatus?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  pricing: { subtotal: number; serviceFee: number; deliveryFee: number; total: number };
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    building?: string; room?: string;
    addressLine1?: string; city?: string; state?: string;
  };
  deliveryCode?: number;
}

const card: React.CSSProperties = {
  backgroundColor: '#f6faf3',
  border: '1px solid rgba(0,107,79,0.1)',
  boxShadow: '0 2px 16px rgba(0,107,79,0.07)',
  borderRadius: '16px',
  padding: '16px',
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: 'rgba(234,179,8,0.12)', color: '#b45309', border: 'rgba(234,179,8,0.35)' },
  confirmed: { bg: 'rgba(59,130,246,0.10)', color: '#1d4ed8', border: 'rgba(59,130,246,0.3)' },
  shipped: { bg: 'rgba(168,85,247,0.10)', color: '#7e22ce', border: 'rgba(168,85,247,0.3)' },
  delivered: { bg: 'rgba(102,153,23,0.12)', color: 'var(--prof-clr)', border: 'rgba(102,153,23,0.3)' },
  collected: { bg: 'rgba(102,153,23,0.12)', color: 'var(--prof-clr)', border: 'rgba(102,153,23,0.3)' },
  cancelled: { bg: 'rgba(239,68,68,0.10)', color: '#b91c1c', border: 'rgba(239,68,68,0.3)' },
};

const imgUrl = (url: string) => url.replace('/upload/', '/upload/q_auto,f_auto,w_300/');

export default function GetOrderById() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api_url}/api/v1/order/get-order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrder(res.ok && data.status === 'success' ? data.data.order : null);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[var(--txt-clr)]">
      <PulseLoader />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[var(--txt-clr)] flex items-center justify-center px-6 text-center">
      <div className="space-y-3">
        <Package size={48} className="text-[var(--acc-clr)] mx-auto opacity-40" />
        <p className="text-lg text-[var(--pry-clr)] sec-ff">Order not found.</p>
        <Link href="/dashboard/my-orders" className="text-[var(--bg-clr)] sec-ff text-sm underline underline-offset-4">
          Back to orders
        </Link>
      </div>
    </div>
  );

  const shortId = `#${order._id.slice(-8).toUpperCase()}`;
  const ss = STATUS_STYLES[order.orderStatus] ?? { bg: 'rgba(10,15,26,0.06)', color: 'var(--pry-clr)', border: 'rgba(10,15,26,0.15)' };
  const addr = order.shippingAddress ?? {};
  const hasInstitution = addr.building || addr.room;
  const shippingLine = hasInstitution
    ? [addr.building, addr.room].filter(Boolean).join(', ')
    : [addr.addressLine1, addr.city, addr.state].filter(Boolean).join(', ') || 'N/A';

  const meta = [
    { icon: Clock, label: 'Placed', value: new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { icon: CreditCard, label: 'Payment', value: order.paymentStatus },
    { icon: Tag, label: 'Delivery Code', value: order.deliveryCode ? String(order.deliveryCode) : '—' },
  ];

  return (
    <div className="min-h-screen bg-[var(--txt-clr)] pb-24">
      <div className="max-w-5xl px-4 pt-6 space-y-5">

        {/* Back + title */}
        <Link href="/dashboard/my-orders"
          className="inline-flex items-center gap-2 text-[var(--bg-clr)] hover:text-[var(--acc-clr)] transition-colors sec-ff text-sm group"
        >
          <ArrowLeft size={15} className="transition-transform duration-150 group-hover:-translate-x-1" />
          Back to Orders
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--pry-clr)] pry-ff">Order Details</h1>
            <p className="text-sm text-[var(--bg-clr)] sec-ff mt-0.5">{shortId}</p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full border capitalize sec-ff shrink-0"
            style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-3 gap-3">
          {meta.map(({ icon: Icon, label, value }) => (
            <div key={label} style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
              <div className="flex items-center gap-1 mb-1">
                <Icon size={12} className="text-[var(--bg-clr)] shrink-0" />
                <span className="text-xs text-[var(--bg-clr)] sec-ff opacity-70 truncate">{label}</span>
              </div>
              <p className="text-sm font-bold text-[var(--pry-clr)] sec-ff capitalize truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2">
            <Package size={15} className="text-[var(--bg-clr)]" /> Items
          </h2>
          {order.items.map((item, i) => (
            <div key={i} style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
              <div className="flex gap-3">
                <div className="flex gap-2 shrink-0">
                  {(item.productImg?.slice(0, 2) ?? []).map((img, idx) => (
                    <div key={idx} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0"
                      style={{ border: '1px solid rgba(0,107,79,0.12)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl(img)} alt={item.title} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ))}
                  {!item.productImg?.length && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(0,107,79,0.08)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--pry-clr)] pry-ff truncate">{item.title}</p>
                  <p className="text-xs text-[var(--bg-clr)] sec-ff mt-0.5 opacity-80">₦{item.price.toLocaleString()} × {item.quantity}</p>
                  {item.itemStatus && (
                    <span className="inline-block mt-1.5 text-xs sec-ff capitalize px-2 py-0.5 rounded-full border font-medium"
                      style={{ background: 'rgba(102,153,23,0.1)', color: 'var(--prof-clr)', borderColor: 'rgba(102,153,23,0.25)' }}>
                      {item.itemStatus}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[var(--bg-clr)] sec-ff whitespace-nowrap self-start">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2 mb-2">
            <MapPin size={15} className="text-[var(--bg-clr)]" /> Shipping Address
          </h2>
          <p className="text-sm text-[var(--pry-clr)] sec-ff opacity-70">{shippingLine}</p>
        </div>

        {/* Pricing */}
        <div style={card} className="transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,107,79,0.13)]">
          <h2 className="text-sm font-semibold text-[var(--pry-clr)] pry-ff flex items-center gap-2 mb-3">
            <CreditCard size={15} className="text-[var(--bg-clr)]" /> Pricing
          </h2>
          <div className="space-y-1.5">
            {[
              { label: 'Subtotal', value: order.pricing.subtotal },
              { label: 'Delivery Fee', value: order.pricing.deliveryFee },
              ...(order.pricing.serviceFee > 0 ? [{ label: 'Service Fee', value: order.pricing.serviceFee }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm sec-ff">
                <span className="text-[var(--pry-clr)] opacity-60">{label}</span>
                <span className="text-[var(--pry-clr)] font-medium">₦{value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 flex justify-between items-center" style={{ borderTop: '1px solid rgba(0,107,79,0.12)' }}>
            <span className="font-bold text-[var(--pry-clr)] pry-ff">Total</span>
            <span className="text-xl font-bold text-[var(--bg-clr)] sec-ff">₦{order.pricing.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {order.orderStatus === 'shipped' && (
            <button onClick={() => setShowPopup(true)}
              className="bg-[var(--bg-clr)] text-[var(--txt-clr)] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 sec-ff cursor-pointer transition text-sm">
              Enter Delivery Code
            </button>
          )}
          {order.paymentStatus !== 'paid' && (
            <Link href={`/order/${order._id}/payment`}
              className="bg-[var(--acc-clr)] text-[var(--pry-clr)] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 sec-ff cursor-pointer transition text-sm">
              Checkout
            </Link>
          )}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          style={{ backgroundColor: 'rgba(10,15,26,0.55)' }}>
          <div className="w-full max-w-md relative" style={{ ...card, borderRadius: '20px', padding: '24px', boxShadow: '0 20px 60px rgba(0,107,79,0.18)' }}>
            <button onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-[var(--bg-clr)] hover:text-[var(--acc-clr)] transition-colors cursor-pointer opacity-70 hover:opacity-100">
              <X size={20} />
            </button>
            <ConfirmDelivery />
          </div>
        </div>
      )}
    </div>
  );
}