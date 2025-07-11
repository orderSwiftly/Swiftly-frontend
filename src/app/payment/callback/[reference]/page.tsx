import PaymentCallbackClient from './paymentCallback';

interface PageProps {
  params: {
    reference: string;
  };
}

export default function Page({ params }: PageProps) {
  return <PaymentCallbackClient reference={params.reference} />;
}