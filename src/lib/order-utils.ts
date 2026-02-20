import { Order } from "@/types/order";

const normalizeStatus = (status?: string): string =>
  status?.toLowerCase().trim() ?? "";

const toStringId = (id: unknown): string => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object" && id !== null && "$oid" in id) {
    return (id as { $oid: string }).$oid;
  }
  return String(id);
};

/**
 * Check if the current seller owns any item in the order
 * AND that item hasn't been shipped yet.
 * If ALL of the seller's items are shipped → canShip = false → button disabled.
 */
export function checkCanShipOrder(order: Order, sellerId: string): boolean {
  const status = normalizeStatus(order.orderStatus);

  // Order must be confirmed to allow shipping
  if (status !== "confirmed") return false;

  // Seller must own at least one item that is NOT yet shipped
  return order.items.some(
    (item) =>
      toStringId(item.productOwnerId) === sellerId &&
      item.itemStatus !== "shipped"
  );
}

export const filterOrdersByTab = (
  ordersTab: "orders" | "active" | "passive",
  orders: Order[],
  currentUserId?: string | null
): Order[] => {
  if (!Array.isArray(orders)) return [];

  return orders.filter((order) => {
    if (currentUserId) {
      const isSellerOrder =
        order.items?.some(
          (item) => toStringId(item.productOwnerId) === toStringId(currentUserId)
        ) ?? false;

      if (!isSellerOrder) return false;
    }

    const status = normalizeStatus(order.orderStatus);

    switch (ordersTab) {
      case "orders":
        return status === "pending";
      case "active":
        return status === "confirmed" || status === "shipped";
      case "passive":
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