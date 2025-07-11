// ✅ Final tested version that avoids global type conflicts

import PaymentCallbackClient from './paymentCallback';

interface LocalPropsFix {
  params: {
    reference: string;
  };
}

export default function Page({ params }: LocalPropsFix) {
  return <PaymentCallbackClient reference={params.reference} />;
}