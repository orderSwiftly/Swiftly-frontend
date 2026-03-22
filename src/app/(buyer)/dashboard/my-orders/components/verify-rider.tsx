// src/app/(buyer)/dashboard/my-orders/components/verify-rider.tsx

'use client';

import { useEffect, useState } from 'react';
import { acceptRider, rejectRider } from '@/lib/rider-order';
import { Loader2, UserCircle, CheckCircle2, XCircle } from 'lucide-react';

interface RiderInfo {
  fullname: string;
  photo: string | null;
}

interface Props {
  orderId: string;
  onAccepted: () => void;
  onRejected: () => void;
}

export default function VerifyRider({ orderId, onAccepted, onRejected }: Props) {
  const [rider, setRider] = useState<RiderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<'accept' | 'reject' | null>(null);

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/v1/order/${orderId}/rider`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch rider');
        setRider(data.data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to fetch rider details');
      } finally {
        setLoading(false);
      }
    };

    fetchRider();
  }, [orderId]);

  const handleAccept = async () => {
    setActionLoading('accept');
    setError(null);
    try {
      await acceptRider(orderId);
      onAccepted();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to accept rider');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading('reject');
    setError(null);
    try {
      await rejectRider(orderId);
      onRejected();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to reject rider');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-[var(--bg-clr)] opacity-60 sec-ff">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Fetching rider details…</span>
      </div>
    );
  }

  if (error && !rider) {
    return (
      <p className="text-sm text-red-400 text-center py-4 sec-ff">{error}</p>
    );
  }

  if (!rider) return null;

  return (
    <div className="space-y-4">
      {/* Rider card */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl sec-ff"
        style={{ backgroundColor: 'rgba(0,107,79,0.06)', border: '1px solid rgba(0,107,79,0.12)' }}
      >
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[rgba(0,107,79,0.1)] flex items-center justify-center">
          {rider.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={rider.photo} alt={rider.fullname} className="w-full h-full object-cover" />
          ) : (
            <UserCircle size={32} className="text-[var(--bg-clr)] opacity-40" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--pry-clr)] truncate">{rider.fullname}</p>
          <p className="text-xs text-[var(--pry-clr)] opacity-50 mt-0.5 sec-ff">Delivery rider</p>
        </div>
      </div>

      <p className="text-xs text-center sec-ff opacity-50" style={{ color: 'var(--pry-clr)' }}>
        This rider has requested to pick up your order. Accept to let them proceed, or reject to put it back in the pool.
      </p>

      {error && (
        <p className="text-xs text-red-400 text-center sec-ff">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleReject}
          disabled={!!actionLoading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition disabled:opacity-50 sec-ff cursor-pointer"
        >
          {actionLoading === 'reject'
            ? <Loader2 size={14} className="animate-spin" />
            : <XCircle size={15} />
          }
          Reject
        </button>
        <button
          onClick={handleAccept}
          disabled={!!actionLoading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-clr)] hover:opacity-90 text-[var(--txt-clr)] text-sm font-semibold transition disabled:opacity-50 sec-ff cursor-pointer"
        >
          {actionLoading === 'accept'
            ? <Loader2 size={14} className="animate-spin" />
            : <CheckCircle2 size={15} />
          }
          Accept
        </button>
      </div>
    </div>
  );
}