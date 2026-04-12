// src/app/(buyer)/dashboard/my-orders/get-orders/page.tsx

"use client";

import OrdersHeader from "../components/orders-header";
import OrderCard from "../components/order-card";
import { useState } from "react";
import { Order } from "@/types/order";
import { getEmptyMessageByTab } from "@/lib/order-utils";
import { ORDER_PROGRESS_MAP } from "@/lib/order-progress";

type Tab = "pending orders" | "active" | "passive";

interface Props {
  orders: Order[];
  currentUserId: string | null;
  shippingLoading: string | null;
  handleShipOrder: (orderId: string) => void;
}

function resolveId(id: string | { $oid: string } | undefined): string {
  if (!id) return "";
  return typeof id === "string" ? id : id.$oid;
}

// Sort by progress step ascending so earlier stages appear first
function sortByProgress(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) =>
      (ORDER_PROGRESS_MAP[a.orderStatus] ?? -1) -
      (ORDER_PROGRESS_MAP[b.orderStatus] ?? -1)
  );
}

export default function GetOrders({
  orders = [],
  currentUserId,
  shippingLoading,
  handleShipOrder,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("pending orders");

  const getFilteredOrders = (): Order[] => {
    switch (activeTab) {
      case "pending orders":
        return sortByProgress(
          orders.filter((o) => o.orderStatus === "pending")
        );
      case "active":
        return sortByProgress(
          orders.filter((o) =>
            ["confirmed", "shipped", "awaiting_verification", "verified", "collected"].includes(o.orderStatus)
          )
        );
      case "passive":
        return sortByProgress(
          orders.filter((o) =>
            ["delivered", "cancelled", "returned"].includes(o.orderStatus)
          )
        );
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="space-y-4">
      <OrdersHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400 sec-ff mt-8">
          {getEmptyMessageByTab(activeTab)}
        </p>
      ) : (
        filteredOrders.map((order, index) => (
          <OrderCard
            key={resolveId(order._id) || index}
            order={order}
            currentUserId={currentUserId || ""}
            shippingLoading={shippingLoading}
            handleShipOrder={handleShipOrder}
          />
        ))
      )}
    </div>
  );
}