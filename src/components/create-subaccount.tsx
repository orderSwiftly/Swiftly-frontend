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
    percentage_charge: 0, // ✅ Required by Paystack, set to 0
  });

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(true);

  // State to show created codes after success
  const [createdCodes, setCreatedCodes] = useState<{ subaccount_code: string; recipient_code: string } | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/flutterwave/banks`);
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
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/paystack/create-subaccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form), // ✅ includes percentage_charge: 0
      });

      const data = await res.json();
      if (!res.ok || data.status !== true) throw new Error(data.message || 'Failed to create subaccount');

      toast.success('Subaccount & recipient created successfully 🎉');
      onSubaccountCreated?.();

      // Store the returned codes to show to the user
      setCreatedCodes({
        subaccount_code: data.data.subaccount_code,
        recipient_code: data.data.recipient_code,
      });

      setForm({
        business_name: '',
        bank_code: '',
        account_number: '',
        percentage_charge: 0, // reset to 0
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueBanks = Array.from(new Map(banks.map(bank => [`${bank.code}-${bank.name}`, bank])).values());

  return (
    <div className="max-w-xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="grid gap-5 sec-ff w-full">
        <div>
          <label htmlFor="business_name" className="text-sm mb-1 block text-[var(--pry-clr)]">Business Name</label>
          <input
            name="business_name"
            id="business_name"
            type="text"
            value={form.business_name}
            onChange={handleChange}
            required
            placeholder="ACME Stores Ltd."
            className="w-full px-4 py-3 rounded-md bg-[var(--txt-clr)] border border-[var(--prof-clr)] text-[var(--pry-clr)] placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="bank_code" className="text-sm mb-1 block text-[var(--pry-clr)]">Bank</label>
          {bankLoading ? (
            <p className="text-gray-700">Loading banks...</p>
          ) : (
            <select
              name="bank_code"
              id="bank_code"
              value={form.bank_code}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-[var(--txt-clr)] border border-[var(--prof-clr)] text-[var(--pry-clr)] focus:outline-none"
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
          <label htmlFor="account_number" className="text-sm mb-1 block text-[var(--pry-clr)]">Account Number</label>
          <input
            name="account_number"
            id="account_number"
            type="text"
            value={form.account_number}
            onChange={handleChange}
            required
            maxLength={10}
            placeholder="0123456789"
            className="w-full px-4 py-3 rounded-md bg-[var(--txt-clr)] border border-[var(--prof-clr)] text-[var(--pry-clr)]"
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

      {createdCodes && (
        <div className="mt-6 p-4 bg-[var(--sec-clr)] rounded-md border border-[var(--prof-clr)] text-[var(--pry-clr)]">
          <p><strong>Subaccount Code:</strong> {createdCodes.subaccount_code}</p>
          <p><strong>Recipient Code:</strong> {createdCodes.recipient_code}</p>
        </div>
      )}
    </div>
  );
}