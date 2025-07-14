'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';

type Bank = {
  name: string;
  code: string;
};

interface CreateSubaccountProps {
  onSubaccountCreated?: () => void;
}

export default function CreateSubaccountPage({ onSubaccountCreated }: CreateSubaccountProps) {
  const [form, setForm] = useState({
    business_name: '',
    bank_code: '',
    account_number: '',
    percentage_charge: 10,
  });

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/paystack/banks`);
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setBanks(data.data);
        } else {
          throw new Error(data.message ?? 'Failed to load banks');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Bank fetch failed';
        toast.error(message);
      } finally {
        setBankLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/paystack/create-subaccount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || data.status !== true) {
        throw new Error(data.message || 'Failed to create sub‑account');
      }

      toast.success('Subaccount created successfully 🎉');
      onSubaccountCreated?.(); // notify parent
      setForm({
        business_name: '',
        bank_code: '',
        account_number: '',
        percentage_charge: 10,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueBanks = Array.from(
    new Map(banks.map(bank => [`${bank.code}-${bank.name}`, bank])).values()
  );

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sec-ff max-w-xl mx-auto w-full">
      <div>
        <label htmlFor="business_name" className="text-sm mb-1 block text-[var(--txt-clr)]">Business Name</label>
        <input
          name="business_name"
          id="business_name"
          type="text"
          value={form.business_name}
          onChange={handleChange}
          required
          placeholder="ACME Stores Ltd."
          className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-[var(--txt-clr)] placeholder-gray-400 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="bank_code" className="text-sm mb-1 block text-[var(--txt-clr)]">Bank</label>
        {bankLoading ? (
          <p className="text-gray-400">Loading banks...</p>
        ) : (
          <select
            name="bank_code"
            id="bank_code"
            value={form.bank_code}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-[var(--txt-clr)] focus:outline-none"
          >
            <option value="" disabled>Select a bank</option>
            {uniqueBanks.map((bank) => (
              <option key={`${bank.code}-${bank.name}`} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label htmlFor="account_number" className="text-sm mb-1 block text-[var(--txt-clr)]">Account Number</label>
        <input
          name="account_number"
          id="account_number"
          type="text"
          value={form.account_number}
          onChange={handleChange}
          required
          maxLength={10}
          placeholder="0123456789"
          className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-[var(--txt-clr)]"
        />
      </div>

      <div>
        <label htmlFor="percentage_charge" className="text-sm mb-1 block text-[var(--txt-clr)]">Platform Charge (%)</label>
        <input
          name="percentage_charge"
          id="percentage_charge"
          type="number"
          value={form.percentage_charge}
          readOnly
          className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/10 text-[var(--txt-clr)] opacity-60 cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-3 rounded-md bg-[var(--acc-clr)] text-[var(--bg-clr)] font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? <PulseLoader /> : 'Create Subaccount'}
      </button>
    </form>
  );
}
