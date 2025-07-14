'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';

type Subaccount = {
  business_name: string;
  bank_code: string;
  account_number: string;
  percentage_charge: number;
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

      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api_url}/api/v1/paystack/subaccount/${subaccountCode}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok && data.status === true) {
          setSubaccount(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch subaccount');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading subaccount');
      } finally {
        setLoading(false);
      }
    };

    fetchSubaccount();
  }, [subaccountCode]);

  return (
    <main className="p-4">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <PulseLoader />
        </div>
      ) : (
        <section className="max-w-xl mx-auto bg-[var(--light-bg)] shadow rounded p-6">
          <h1 className="text-xl font-bold mb-4 text-[var(--txt-clr)]">Subaccount Details</h1>

          {subaccount ? (
            <div className="space-y-2 text-[var(--txt-clr)]">
              <p><strong>Business Name:</strong> {subaccount.business_name}</p>
              <p><strong>Bank Code:</strong> {subaccount.bank_code}</p>
              <p><strong>Account Number:</strong> {subaccount.account_number}</p>
              <p><strong>Percentage Charge:</strong> {subaccount.percentage_charge}%</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No subaccount found.</p>
          )}
        </section>
      )}
    </main>
  );
}
