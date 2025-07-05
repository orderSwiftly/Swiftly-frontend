'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Bank {
  name: string;
  code: string;
}

interface BankSelectorProps {
  onSelect: (code: string) => void;
}

export default function BankSelector({ onSelect }: BankSelectorProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/paystack/banks`);
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setBanks(data.data);
        } else {
          throw new Error(data.message ?? 'Failed to fetch banks');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading banks';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  if (loading) return <p className="text-gray-400">Loading banks...</p>;

  return (
    <select
      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3
                 text-[var(--txt-clr)] appearance-none
                 focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]"
      onChange={(e) => onSelect(e.target.value)}
      defaultValue=""
    >
      <option value="" disabled className="bg-[var(--bg-clr)] text-[var(--txt-clr)]">
        Select Bank
      </option>
      {banks.map((bank, index) => (
        <option
          key={`${bank.code}-${bank.name}-${index}`}
          value={bank.code}
          className="bg-[var(--bg-clr)] text-[var(--txt-clr)]"
        >
          {bank.name}
        </option>
      ))}
    </select>
  );
  
}