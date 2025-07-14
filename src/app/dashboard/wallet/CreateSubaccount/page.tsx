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

  const fetchUserSubaccount = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/user/paystack/subaccount`, {
        method: 'GET',
        credentials: 'include',
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
    fetchUserSubaccount();
  }, []);

  const handleSubaccountCreated = () => {
    setIsModalOpen(false);
    fetchUserSubaccount();
  };

  return (
    <main className="p-6 space-y-6 bg-[var(--light-bg)] min-h-screen flex flex-col items-center justify-between">
      {/* Header */}
      <section className="flex items-center justify-between mb-4 bg-white/20 backdrop-blur-lg p-4 rounded shadow-md w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-[var(--txt-clr)] pry-ff">Subaccount Page</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--acc-clr)] sec-ff text-[var(--bg-clr)] px-4 py-2 font-semibold rounded hover:opacity-90 transition cursor-pointer shadow-md"
        >
          Create Subaccount
        </button>
      </section>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PulseLoader />
        </div>
      ) : (
        <>
          {subaccountCode ? (
            <GetSubaccount subaccountCode={subaccountCode} />
          ) : (
            <p className="text-gray-500 sec-ff">No subaccount exists for this user yet.</p>
          )}
        </>
      )}

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
            <h2 className="text-xl font-semibold text-[var(--txt-clr)] mb-4">Create Subaccount</h2>
            <CreateSubaccountPage onSubaccountCreated={handleSubaccountCreated} />
          </div>
        </div>
      )}
    </main>
  );
}