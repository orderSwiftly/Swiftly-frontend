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
