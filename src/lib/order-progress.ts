// src/lib/order-progress.ts

export const ORDER_PROGRESS_MAP: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    shipped: 2,
    awaiting_verification: 3,
    verified: 4,
    collected: 5,
    delivered: 6,
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Your order is awaiting payment',
  confirmed: 'Your payment was received and order confirmed',
  shipped: 'Your order has been prepared and is on the way',
  awaiting_verification: 'A rider is nearby — verify before handoff',
  verified: 'You verified the rider successfully',
  collected: 'Rider has collected your order from the vendor',
  delivered: 'Your order has been delivered',
};