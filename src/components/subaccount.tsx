'use client';

import { useEffect, useState } from 'react';
import GetSubaccount from './get-subaccount';
import CreateSubaccountPage from './create-subaccount';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import {
  Landmark,
  PlusCircle,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function SubaccountPage() {
  const [subaccountCode, setSubaccountCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubaccount = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(`${api_url}/api/v1/paystack/user/subaccount`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.status === true && data.data?.subaccount_code) {
        setSubaccountCode(data.data.subaccount_code);
      } else {
        setSubaccountCode(null);
      }
    } catch (error) {
      console.error('Error fetching subaccount:', error);
      toast.error('Failed to fetch subaccount');
      setSubaccountCode(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubaccount();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const handleSubaccountCreated = () => {
    setIsModalOpen(false);
    setLoading(true);
    setSubaccountCode(null);
    fetchSubaccount();
  };

  return (
    <main className="min-h-screen w-full bg-white sec-ff mb-14">

      {/* ── Top banner ─────────────────────────────────── */}
      <div className="bg-[#006B4F] px-5 py-8 mt-7">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5">
              <Landmark size={22} className="text-[#9BDD37]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Account Management
              </h1>
              <p className="text-white/55 text-sm mt-0.5">
                Manage your Paystack subaccount details
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-[#9BDD37] text-[#0A0F1A] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#89cc28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            {subaccountCode ? (
              <><Eye size={16} /> View Details</>
            ) : (
              <><PlusCircle size={16} /> Create Account</>
            )}
          </button>
        </div>
      </div>

      {/* ── Page body ──────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-5 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#c0c0c0]">
            <PulseLoader />
            <p className="text-sm">Fetching account details…</p>
          </div>
        ) : subaccountCode ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-[#669917] bg-[#9BDD37]/10 border border-[#9BDD37]/30 rounded-full px-4 py-2 w-fit">
              <ShieldCheck size={15} />
              Subaccount active
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#006B4F]/5 border-b border-[#e8e8e8] px-6 py-4 flex items-center gap-2">
                <CreditCard size={16} className="text-[#669917]" />
                <span className="text-sm font-semibold text-[#0A0F1A]">Subaccount Details</span>
              </div>
              <div className="p-6">
                <GetSubaccount subaccountCode={subaccountCode} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="bg-[#006B4F]/8 rounded-full p-6">
              <Landmark size={40} className="text-[#006B4F]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-[#0A0F1A]">No bank account linked</h2>
              <p className="text-[#c0c0c0] text-sm max-w-xs">
                You haven't added a subaccount yet. Add your bank account to start receiving payments.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#006B4F] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#005a42] transition-colors"
            >
              <PlusCircle size={16} />
              Add your Bank Account
            </button>
          </div>
        )}
      </div>

      {/* ── Modal ──────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#0A0F1A]/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[1000] px-0 sm:px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          {/*
            On mobile:  slides up from the bottom, rounded top corners, max-h so it never
                        fills the full screen, inner content scrolls.
            On desktop: centered card, same max-h scroll behaviour.
          */}
          <div className="
            bg-white w-full sm:max-w-lg
            rounded-t-2xl sm:rounded-2xl
            shadow-xl overflow-hidden
            flex flex-col
            max-h-[90dvh] sm:max-h-[85vh]
          ">
            {/* Sticky header — always visible */}
            <div className="bg-[#006B4F] px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                {subaccountCode ? (
                  <CreditCard size={18} className="text-[#9BDD37]" />
                ) : (
                  <PlusCircle size={18} className="text-[#9BDD37]" />
                )}
                <h2 className="text-white font-semibold">
                  {subaccountCode ? 'Account Details' : 'Add Bank Account'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-white/10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-6">
              {subaccountCode ? (
                <GetSubaccount subaccountCode={subaccountCode} />
              ) : (
                <CreateSubaccountPage onSubaccountCreated={handleSubaccountCreated} />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}