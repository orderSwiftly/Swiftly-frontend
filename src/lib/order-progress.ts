// src/lib/order-progress.ts

export const ORDER_PROGRESS_MAP: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    prepared: 2,
    claimed: 3,
    collected: 4,
    delivered: 5,
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Your order is awaiting payment',
  confirmed: 'Your payment was received and order confirmed',
  prepared: 'Your order has been prepared and waiting for pickup',
  claimed: 'Your order has been claimed by a rider',
  collected: 'Rider has collected your order from the vendor',
  delivered: 'Your order has been delivered',
};