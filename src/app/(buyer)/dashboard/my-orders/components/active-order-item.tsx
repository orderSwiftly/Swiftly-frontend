// src/app/(buyer)/dashboard/my-orders/components/active-order-item.tsx

"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export interface ActiveOrderItem {
  _id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
  estimatedTime: string;
  paymentMethod: string;
  status: string;
  riderName?: string;
  riderPhone?: string;
}

interface ActiveOrderItemProps {
  order: ActiveOrderItem;
  onClick?: () => void;
}

export default function ActiveOrderItemCard({
  order,
  onClick,
}: ActiveOrderItemProps) {
  const getProgressSegments = (status: string) => {
    if (status.includes("accepted")) return 1;
    if (status.includes("waiting")) return 2;
    if (status.includes("Prepared") || status.includes("preparing")) return 3;
    return 1;
  };

  const activeSegments = getProgressSegments(order.status);

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
        <span className="text-[#669917] font-bold">{order.estimatedTime}</span>
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
            className={`h-1 flex-1 rounded-full ${
              segment <= activeSegments ? "bg-[#4D770D]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-700 text-center">{order.status}</p>

      {order.riderName && order.riderPhone && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <div>
            <p className="text-gray-500">Rider Name:</p>
            <p className="font-medium text-gray-900">{order.riderName}</p>
          </div>
          <div>
            <p className="text-gray-500">Rider Number:</p>
            <p className="font-medium text-green-600">{order.riderPhone}</p>
          </div>
        </div>
      )}
    </div>
  );
}
