const DELIVERY_FEE = 500;

function calculateServiceFee(subtotal: number): number {
  if (subtotal < 1000) return 0;
  const capped = Math.min(subtotal, 2999999);
  const steps = Math.floor(capped / 10000);
  return 50 + 50 * steps;
}

export default function calculateTotals(subtotal: number) {
  const serviceFee = calculateServiceFee(subtotal);
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + serviceFee + deliveryFee;

  return {
    subtotal,
    serviceFee,
    deliveryFee,
    total,
  };
}