'use client';

import dynamic from 'next/dynamic';
import PulseLoader from '@/components/pulse-loader';

const CreateSubaccountPage = dynamic(() => import('./CreateSubaccount/page'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <PulseLoader />
    </div>
  ),
  ssr: false,
});

export default function WalletPage() {
  return <CreateSubaccountPage />;
}
