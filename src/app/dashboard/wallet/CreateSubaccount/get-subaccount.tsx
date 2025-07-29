'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';

type Subaccount = {
  business_name: string;
  account_name: string;
  account_number: string;
  settlement_bank: string;
  percentage_charge: number;
  currency: string;
  is_verified: boolean;
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

  return (
    <main className="p-4">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <PulseLoader />
        </div>
      ) : (
        <section className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow rounded p-6">
          <h1 className="text-xl font-bold mb-4 text-[var(--acc-clr)] pry-ff">Subaccount Details</h1>

          {subaccount ? (
            <div className="space-y-2 text-[var(--txt-clr)] sec-ff">
              <p><strong className='text-[var(--acc-clr)]'>Business Name:</strong> {subaccount.business_name || 'N/A'}</p>
              <p><strong className='text-[var(--acc-clr)]'>Account Name:</strong> {subaccount.account_name || 'N/A'}</p>
              <p><strong className='text-[var(--acc-clr)]'>Account Number:</strong> {subaccount.account_number || 'N/A'}</p>
              <p><strong className='text-[var(--acc-clr)]'>Settlement Bank:</strong> {subaccount.settlement_bank || 'N/A'}</p>
              <p><strong className='text-[var(--acc-clr)]'>Currency:</strong> {subaccount.currency || 'NGN'}</p>
              <p><strong className='text-[var(--acc-clr)]'>Percentage Charge:</strong> {subaccount.percentage_charge}%</p>
              <p>
                <strong className='text-[var(--acc-clr)]'>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    subaccount.is_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {subaccount.is_verified ? 'Verified' : 'Not Verified'}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No subaccount details available.</p>
          )}
        </section>
      )}
    </main>
  );
}
