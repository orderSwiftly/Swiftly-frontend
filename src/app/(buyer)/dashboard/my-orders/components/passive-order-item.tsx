// src/app/(buyer)/dashboard/my-orders/components/passive-order-item.tsx

"use client";

import Image from "next/image";

export interface PassiveOrderItem {
  _id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
  date: string;
  paymentMethod: string;
  status: "completed" | "canceled";
}

interface PassiveOrderItemProps {
  order: PassiveOrderItem;
  onClick?: () => void;
}

export default function PassiveOrderItemCard({
  order,
  onClick,
}: PassiveOrderItemProps) {
  const isCompleted = order.status === "completed";
  const progressColor = isCompleted ? "bg-[#4D770D]" : "bg-red-600";
  const statusText = isCompleted ? "Order completed" : "Order canceled";

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {order.productImg && order.productImg[0] ? (
            <Image
              src={order.productImg[0]}
              alt={order.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <div className="flex flex-row justify-between w-full items-center">
          <h3 className="font-bold text-gray-900 line-clamp-2">
            {order.title}
          </h3>
          <p className="font-semibold text-gray-900 mt-1">
            ₦{order.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-3">
        <span className="border border-gray-300 rounded-xs px-2">
          {order.quantity}
        </span>
        <span className="text-[#669917] font-bold">{order.date}</span>
        <div className="flex items-center gap-1">
          <span>Payment:</span>
          <span className="font-medium">{order.paymentMethod}</span>
          {order.paymentMethod === "Cash" && <span>💵</span>}
          {order.paymentMethod === "Card" && <span>💳</span>}
          {order.paymentMethod === "Transfer" && <span>🏦</span>}
        </div>
      </div>

      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5, 6].map((segment) => (
          <div
            key={segment}
            className={`h-1 flex-1 rounded-full ${progressColor}`}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-[#0C0C0C] text-center">
        {statusText}
      </p>
    </div>
  );
}
