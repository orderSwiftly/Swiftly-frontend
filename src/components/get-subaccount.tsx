'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import {
  Building2,
  User,
  Hash,
  Landmark,
  Coins,
  ShieldCheck,
  ShieldX,
  Tag,
} from 'lucide-react';

type Subaccount = {
  business_name: string;
  account_name: string;
  account_number: string;
  settlement_bank: string;
  percentage_charge: number;
  currency: string;
  is_verified: boolean;
  recipient_code?: string;
};

interface GetSubaccountProps {
  readonly subaccountCode: string;
}

export default function GetSubaccount({ subaccountCode }: GetSubaccountProps) {
  const [loading, setLoading] = useState(true);
  const [subaccount, setSubaccount] = useState<Subaccount | null>(null);

  useEffect(() => {
    const fetchSubaccount = async () => {
      if (!subaccountCode || !subaccountCode.startsWith('ACCT_')) {
        toast.error('Invalid or missing subaccount code');
        setLoading(false);
        return;
      }

      const api_url = process.env.NEXT_PUBLIC_API_URL;
      if (!api_url) {
        toast.error('API URL is not defined');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found in localStorage');

        const res = await fetch(`${api_url}/api/v1/paystack/subaccount/${subaccountCode}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch subaccount');
        }

        const data = await res.json();

        if (data.status === true && data.data) {
          setSubaccount(data.data);
        } else {
          throw new Error(data.message || 'Subaccount not found');
        }
      } catch (err: unknown) {
        console.error('Subaccount fetch error:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'Error fetching subaccount';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSubaccount();
  }, [subaccountCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <PulseLoader />
      </div>
    );
  }

  if (!subaccount) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#c0c0c0] sec-ff">
        <ShieldX size={36} strokeWidth={1.5} />
        <p className="text-sm">No subaccount details available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sec-ff">

      {/* ── Verification banner ──────────────────────── */}
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 ${subaccount.is_verified
            ? 'bg-[#9BDD37]/10 border border-[#9BDD37]/30'
            : 'bg-red-50 border border-red-200'
          }`}
      >
        {subaccount.is_verified ? (
          <ShieldCheck size={20} className="text-[#669917] shrink-0" />
        ) : (
          <ShieldX size={20} className="text-red-500 shrink-0" />
        )}
        <div>
          <p className={`text-sm font-semibold ${subaccount.is_verified ? 'text-[#669917]' : 'text-red-600'}`}>
            {subaccount.is_verified ? 'Account Verified' : 'Not Verified'}
          </p>
          <p className="text-xs text-[#c0c0c0] mt-0.5">
            {subaccount.is_verified
              ? 'This account has been verified by Paystack.'
              : 'This account is pending verification.'}
          </p>
        </div>
      </div>

      {/* ── 2-column grid of detail cards ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <DetailCard
          icon={<Building2 size={16} className="text-[#669917]" />}
          label="Business Name"
          value={subaccount.business_name}
        />

        <DetailCard
          icon={<User size={16} className="text-[#669917]" />}
          label="Account Name"
          value={subaccount.account_name}
        />

        <DetailCard
          icon={<Hash size={16} className="text-[#669917]" />}
          label="Account Number"
          value={subaccount.account_number}
          mono
        />

        <DetailCard
          icon={<Landmark size={16} className="text-[#669917]" />}
          label="Settlement Bank"
          value={subaccount.settlement_bank}
        />

        <DetailCard
          icon={<Coins size={16} className="text-[#669917]" />}
          label="Currency"
          value={subaccount.currency || 'NGN'}
        />

        <DetailCard
          icon={<Tag size={16} className="text-[#669917]" />}
          label="Recipient Code"
          value={subaccount.recipient_code}
          mono
        />

      </div>
    </div>
  );
}

/* ── Reusable detail card ─────────────────────────────── */
function DetailCard({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl p-4 flex flex-col gap-2 hover:border-[#9BDD37] hover:shadow-sm transition-all sec-ff">
      <div className="flex items-center gap-2">
        <div className="bg-[#006B4F]/8 rounded-lg p-1.5">
          {icon}
        </div>
        <span className="text-xs text-[#c0c0c0] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-[#0A0F1A] font-medium text-sm pl-0.5 ${mono ? 'font-mono tracking-wide' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  );
}