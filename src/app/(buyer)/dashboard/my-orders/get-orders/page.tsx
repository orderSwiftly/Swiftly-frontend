// src/app/(buyer)/dashboard/my-orders/get-orders/page.tsx
"use client";

import OrdersHeader from "../components/orders-header";
import OrderCard from "../components/order-card";
import { useState } from "react";
import { Order } from "@/types/order";
import { getEmptyMessageByTab } from "@/lib/order-utils";

interface Props {
  orders: Order[];
  currentUserId: string | null;
  shippingLoading: string | null;
  handleShipOrder: (orderId: string) => void;
}

export default function GetOrders({
  orders = [],
  currentUserId,
  shippingLoading,
  handleShipOrder,
}: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "active" | "passive">(
    "orders"
  );

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "orders":
        return orders.filter((o) => o.orderStatus === "pending");
      case "active":
        return orders.filter(
          (o) =>
            o.orderStatus === "confirmed" ||
            o.orderStatus === "shipped"
        );
      case "passive":
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
            key={order._id.$oid ?? index}
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
