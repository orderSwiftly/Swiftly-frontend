"use client";

import { useState } from "react";

interface OrdersHeaderProps {
  activeTab: "orders" | "active" | "passive";
  onTabChange: (tab: "orders" | "active" | "passive") => void;
}

export default function OrdersHeader({
  activeTab,
  onTabChange,
}: OrdersHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl text-center font-bold text-[#0A0A0A]">
          Orders
        </h1>
      </div>

      <div className="flex items-center px-4">
        <button
          onClick={() => onTabChange("orders")}
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-[#355505] text-[#355505]"
              : "border-transparent text-[#9C9C9C] hover:text-gray-700"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => onTabChange("active")}
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "active"
              ? "border-[#355505] text-[#355505]"
              : "border-transparent text-[#9C9C9C] hover:text-gray-700"
          }`}
        >
          Active Orders
        </button>
        <button
          onClick={() => onTabChange("passive")}
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "passive"
              ? "border-[#355505] text-[#355505]"
              : "border-transparent text-[#9C9C9C] hover:text-gray-700"
          }`}
        >
          Passive Orders
        </button>
      </div>
    </div>
  );
}
