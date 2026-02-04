// src/lib/cartTotals.ts

const DELIVERY_FEE = 300;

function calculateVAT(subtotal: number): number {
  if (subtotal <= 1000) return 0;
  if (subtotal <= 9999) return 100;
  if (subtotal <= 19999) return 150;
  if (subtotal <= 99999) return 200;
  return 250;
}

export default function calculateTotals(subtotal: number) {
  const serviceFee = calculateVAT(subtotal);
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + serviceFee + deliveryFee;

  return {
    subtotal,
    serviceFee,
    deliveryFee,
    total,
  };
}