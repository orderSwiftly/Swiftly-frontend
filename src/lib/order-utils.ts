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

// ── Seller tabs ──────────────────────────────────────
export type SellerTab = "pending orders" | "active" | "delivered";

export const filterOrdersByTab = (
  ordersTab: SellerTab,
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
      case "pending orders":
        return status === "confirmed";
      case "active":
        return (
          status === "shipped" ||
          status === "collected"
        );
      case "delivered":
        return status === "delivered";
      default:
        return false;
    }
  });
};

export const getSellerEmptyMessage = (tab: SellerTab): string => {
  const messages: Record<SellerTab, string> = {
    "pending orders": "No confirmed orders yet.",
    active: "No active orders.",
    delivered: "No delivered orders yet.",
  };
  return messages[tab];
};

// ── Buyer tabs ───────────────────────────────────────
export type BuyerTab = "pending orders" | "active" | "passive";

export const getBuyerEmptyMessage = (tab: BuyerTab): string => {
  const messages: Record<BuyerTab, string> = {
    "pending orders": "You have no pending orders.",
    active: "You have no active orders.",
    passive: "You have no delivered orders.",
  };
  return messages[tab];
};

export const getEmptyMessageByTab = getBuyerEmptyMessage;