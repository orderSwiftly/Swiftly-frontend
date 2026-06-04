"use client";

import OrdersHeader from "../components/orders-header";
import OrderCard from "../components/order-card";
import { useState, useEffect } from "react";
import { Order } from "@/types/order";
import { getEmptyMessageByTab } from "@/lib/order-utils";
import { ORDER_PROGRESS_MAP } from "@/lib/order-progress";
import Image from "next/image";
import RateRiderModal from "@/components/rate-rider-modal";

type Tab = "active" | "passive";

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

const normalizeStatus = (status?: string): string =>
  status?.toLowerCase().trim() ?? "";

function sortByProgress(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) =>
      (ORDER_PROGRESS_MAP[normalizeStatus(a.orderStatus)] ?? -1) -
      (ORDER_PROGRESS_MAP[normalizeStatus(b.orderStatus)] ?? -1)
  );
}

export default function GetOrders({
  orders = [],
  currentUserId,
  shippingLoading,
  handleShipOrder,
}: Readonly<Props>) {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!orders.length) return;

    const pending = orders.find(
      (o) =>
        normalizeStatus(o.orderStatus) === "delivered" &&
        !o.riderRated &&
        !ratedIds.has(o._id)
    );

    if (pending) setRatingOrder(pending);
  }, [orders, ratedIds]);

  const getFilteredOrders = (): Order[] => {
    switch (activeTab) {
      case "active":
        return sortByProgress(
          orders.filter((o) =>
            ["confirmed", "prepared", "claimed", "collected"].includes(
              normalizeStatus(o.orderStatus)
            )
          )
        );
      case "passive":
        return sortByProgress(
          orders.filter((o) =>
            ["delivered", "cancelled", "returned"].includes(
              normalizeStatus(o.orderStatus)
            )
          )
        );
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  const handleOrderClick = (order: Order) => {
    if (normalizeStatus(order.orderStatus) === "delivered" && !order.riderRated) {
      setRatingOrder(order);
    }
  };

  return (
    <div className="space-y-4">
      <OrdersHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] pry-ff text-[var(--sec-clr)]">
          <Image
            src="/no_orders.png"
            alt="No orders found"
            width={200}
            height={200}
            className="mb-4"
          />
          <p className="text-center text-gray-400 sec-ff mt-8">
            {getEmptyMessageByTab(activeTab)}
          </p>
        </div>
      ) : (
        filteredOrders.map((order, index) => (
          <div
            key={resolveId(order._id) || index}
            onClick={() => handleOrderClick(order)}
            className={
              normalizeStatus(order.orderStatus) === "delivered" && !order.riderRated
                ? "cursor-pointer"
                : ""
            }
          >
            <OrderCard
              order={order}
              currentUserId={currentUserId || ""}
              shippingLoading={shippingLoading}
              handleShipOrder={handleShipOrder}
            />
          </div>
        ))
      )}

      {ratingOrder && (
        <RateRiderModal
          orderId={ratingOrder._id}
          onClose={() => setRatingOrder(null)}
          onDone={() => {
            setRatedIds((prev) => new Set(prev).add(ratingOrder._id));
            setRatingOrder(null);
          }}
        />
      )}
    </div>
  );
}