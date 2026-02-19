import { Order } from "@/types/order";

/**
 * Normalize order status coming from backend
 */
const normalizeStatus = (status?: string): string =>
  status?.toLowerCase().trim() ?? "";

/**
 * Check if the current user owns any item in the order
 * (Mongo ObjectId-safe comparison)
 */
export const checkCanShipOrder = (
  order: Order,
  currentUserId: string | null
): boolean => {
  if (!currentUserId) return false;

  return (
    order.items?.some(
      (item) =>
        String(item.productOwnerId) === String(currentUserId)
    ) ?? false
  );
};

/**
 * Filter orders based on tab
 * SINGLE SOURCE OF TRUTH for buyer & seller dashboards
 */
export const filterOrdersByTab = (
  ordersTab: "orders" | "active" | "passive",
  orders: Order[],
  currentUserId?: string | null
): Order[] => {
  if (!Array.isArray(orders)) return [];

  return orders.filter((order) => {
    // 🔒 Seller-only visibility
    if (currentUserId) {
      const isSellerOrder =
        order.items?.some(
          (item) =>
            String(item.productOwnerId) ===
            String(currentUserId)
        ) ?? false;

      if (!isSellerOrder) return false;
    }

    const status = normalizeStatus(order.orderStatus);

    switch (ordersTab) {
      case "orders":
        // New orders awaiting seller action
        return status === "pending";

      case "active":
        // Seller is actively processing these
        return (
          status === "confirmed" ||
          status === "shipped"
        );

      case "passive":
        // Completed or terminated orders
        return (
          status === "delivered" ||
          status === "cancelled" ||
          status === "returned"
        );

      default:
        return false;
    }
  });
};

/**
 * Empty-state messages per tab
 */
export const getEmptyMessageByTab = (
  ordersTab: "orders" | "active" | "passive"
): string => {
  const messages: Record<typeof ordersTab, string> = {
    orders: "You have no pending orders.",
    active: "You have no active orders.",
    passive: "You have no passive orders.",
  };

  return messages[ordersTab];
};