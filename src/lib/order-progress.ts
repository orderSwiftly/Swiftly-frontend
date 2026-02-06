// src/lib/order-progress.ts

export const ORDER_PROGRESS_MAP: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    shipped: 2,
    delivered: 5,
};
