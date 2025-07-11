// app/payment/callback/[reference]/page.tsx

import PaymentCallbackClient from './paymentCallback';

export default function Page({ params }: { readonly params: { readonly reference: string } }) {
  return <PaymentCallbackClient reference={params.reference} />;
}
