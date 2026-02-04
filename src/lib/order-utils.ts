// src/lib/order-utils.ts
import { Order } from "@/types/order";

/**
 * Check if the current user owns any item in the order (can ship)
 */
export const checkCanShipOrder = (
  order: Order,
  currentUserId: string | null
): boolean => {
  if (!currentUserId) return false;
  return order.items.some((item) => item.productOwnerId === currentUserId);
};

/**
 * Filter orders based on tab
 * ordersTab = 'orders' | 'active' | 'passive'
 */
export const filterOrdersByTab = (
  ordersTab: "orders" | "active" | "passive",
  orders: Order[],
  currentUserId?: string | null
): Order[] => {
  switch (ordersTab) {
    case "orders":
      // pending orders
      return orders.filter((o) => o.orderStatus === "pending");

    case "active":
      // confirmed or shipped
      return orders.filter(
        (o) =>
          o.orderStatus === "confirmed" ||
          o.orderStatus === "shipped"
      );

    case "passive":
      // delivered, cancelled, returned
      return orders.filter(
        (o) =>
          o.orderStatus === "delivered" ||
          o.orderStatus === "cancelled" ||
          o.orderStatus === "returned"
      );

    default:
      return orders;
  }
};

/**
 * Get empty message for a tab
 */
export const getEmptyMessageByTab = (ordersTab: string): string => {
  const messages: Record<string, string> = {
    orders: "You have no pending orders.",
    active: "You have no active orders.",
    passive: "You have no passive orders.",
  };
  return messages[ordersTab] || "No orders found.";
};