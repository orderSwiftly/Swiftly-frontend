'use client';

import { useEffect, useState } from 'react';
import GetSubaccount from './get-subaccount';
import CreateSubaccountPage from './create-subaccount';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';

export default function SubaccountPage() {
  const [subaccountCode, setSubaccountCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserSubaccount = async () => {
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const res = await fetch(`${api_url}/api/v1/paystack/user/subaccount`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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

    fetchUserSubaccount();
  }, []);

  const handleSubaccountCreated = () => {
    setIsModalOpen(false);
    setLoading(true);
    setSubaccountCode(null); // reset before refetching
    
    // Refetch subaccount data
    const refetch = async () => {
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${api_url}/api/v1/paystack/user/subaccount`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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
        console.error('Error refetching subaccount:', error);
        toast.error('Failed to refresh subaccount');
        setSubaccountCode(null);
      } finally {
        setLoading(false);
      }
    };
    
    refetch();
  };

  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] pt-[70px] md:pl-72 flex justify-start flex-col px-2 space-y-10">
      {/* Header */}
      <section className="flex items-center justify-between w-full max-w-5xl bg-white/20 backdrop-blur-lg p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold text-[var(--txt-clr)] pry-ff">Subaccount Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-4 py-2 rounded font-semibold hover:opacity-90 transition sec-ff cursor-pointer"
          disabled={loading}
        >
          {subaccountCode ? 'View Details' : 'Create Subaccount'}
        </button>
      </section>

      {/* Content */}
      <section className="w-full max-w-3xl">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <PulseLoader />
          </div>
        ) : subaccountCode ? (
          <GetSubaccount subaccountCode={subaccountCode} />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500 sec-ff mb-4">No subaccount exists for this user yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Create Your First Subaccount
            </button>
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-[var(--txt-clr)] mb-4">
              {subaccountCode ? 'Subaccount Details' : 'Create Subaccount'}
            </h2>
            {subaccountCode ? (
              <GetSubaccount subaccountCode={subaccountCode} />
            ) : (
              <CreateSubaccountPage onSubaccountCreated={handleSubaccountCreated} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}