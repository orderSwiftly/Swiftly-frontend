// src/app/payment/callback/[reference]/page.tsx

import PaymentCallbackPage from './paymentCallback'; // This will be a client component

export default function Page({ params }: { params: { reference: string } }) {
  return <PaymentCallbackPage reference={params.reference} />;
}