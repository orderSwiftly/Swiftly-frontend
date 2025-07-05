'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import BankSelector from './bank-selector';
import PulseLoader from '@/components/pulse-loader';

export default function CreateSubaccount() {
  const [form, setForm] = useState({
    business_name: '',
    bank_code: '',
    account_number: '',
    percentage_charge: 10,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/paystack/create-subaccount`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok || data.status !== true) {
        throw new Error(data.message || 'Failed to create sub‑account');
      }

      toast.success('Sub‑account created 🎉');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-white/5 shadow-xl border border-white/10">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--txt-clr)] mb-6">
        Create Subaccount
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-5">
        {/* Business Name */}
        <div>
          <label htmlFor="business_name" className="text-sm block mb-1 text-[var(--txt-clr)]">
            Business Name
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            required
            value={form.business_name}
            onChange={handleChange}
            placeholder="ACME Stores Ltd."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                       placeholder-gray-400 text-[var(--txt-clr)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]"
          />
        </div>

        {/* Bank Selector */}
        <div>
          <label htmlFor="bank_code" className="text-sm block mb-1 text-[var(--txt-clr)]">
            Bank
          </label>
          <BankSelector
            onSelect={(code) => setForm((prev) => ({ ...prev, bank_code: code }))}
          />
        </div>

        {/* Account Number */}
        <div>
          <label htmlFor="account_number" className="text-sm block mb-1 text-[var(--txt-clr)]">
            Account Number
          </label>
          <input
            id="account_number"
            name="account_number"
            type="text"
            required
            maxLength={10}
            value={form.account_number}
            onChange={handleChange}
            placeholder="0123456789"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                       placeholder-gray-400 text-[var(--txt-clr)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]"
          />
        </div>

        {/* Percentage Charge */}
        <div>
          <label htmlFor="percentage_charge" className="text-sm block mb-1 text-[var(--txt-clr)]">
            Percentage Charge (%)
          </label>
          <input
    id="percentage_charge"
    name="percentage_charge"
    type="number"
    value={form.percentage_charge}
    disabled
    className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3
               focus:outline-none placeholder-gray-400 text-[var(--txt-clr)] opacity-60 cursor-not-allowed"
  />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)]
                     font-semibold py-3 transition-opacity duration-200 hover:opacity-90
                     disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <PulseLoader /> : 'Create Subaccount'}
        </button>
      </form>
    </section>
  );
}
