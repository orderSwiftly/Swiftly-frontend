import dynamic from 'next/dynamic';

const PaymentCallbackPage = dynamic(() => import('./paymentCallback'), { ssr: false });

export default function Page({ params }: { params: { reference: string } }) {
  return <PaymentCallbackPage reference={params.reference} />;
}
