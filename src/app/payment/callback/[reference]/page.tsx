// app/payment/callback/[reference]/page.tsx

import PaymentCallbackClient from './paymentCallback';

export default function Page({ params }: { readonly params: { readonly reference: string } }) { // this won't work
  return <PaymentCallbackClient reference={params.reference} />;
}
