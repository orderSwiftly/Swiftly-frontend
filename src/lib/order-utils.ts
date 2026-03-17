// src/lib/order-utils.ts

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

export function checkCanShipOrder(order: Order, sellerId: string): boolean {
  const status = normalizeStatus(order.orderStatus);
  if (status !== "confirmed") return false;
  return order.items.some(
    (item) =>
      toStringId(item.productOwnerId) === sellerId &&
      item.itemStatus !== "shipped"
  );
}

export const filterOrdersByTab = (
  ordersTab: "orders" | "active" | "delivered",
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
        return status === "confirmed";
      case "active":
        return (
          status === "shipped" ||
          status === "claimed" ||
          status === "collected"
        );
      case "delivered":
        return status === "delivered";
      default:
        return false;
    }
  });
};

export const getEmptyMessageByTab = (
  ordersTab: "orders" | "active" | "delivered"
): string => {
  const messages: Record<typeof ordersTab, string> = {
    orders: "No confirmed orders yet.",
    active: "No active orders.",
    delivered: "No delivered orders yet.",
  };
  return messages[ordersTab];
};