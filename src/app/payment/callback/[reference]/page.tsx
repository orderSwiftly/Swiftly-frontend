// ❌ NO 'use client' here

import PaymentCallbackPage from './paymentCallback';

type PageProps = {
  params: {
    reference: string;
  };
};

export default function Page({ params }: PageProps) {
  return <PaymentCallbackPage reference={params.reference} />;
}