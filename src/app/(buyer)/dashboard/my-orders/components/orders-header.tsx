// src/app/(buyer)/dashboard/my-orders/components/orders-header.tsx
"use client";

interface OrdersHeaderProps {
  activeTab: "pending orders" | "active" | "passive";
  onTabChange: (tab: "orders" | "active" | "passive") => void;
}

export default function OrdersHeader({
  activeTab,
  onTabChange,
}: OrdersHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 pry-ff">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl text-center font-bold text-[var(--bg-clr)]">
          Orders
        </h1>
      </div>

      <div className="flex items-center px-4">
        {["pending orders", "active", "passive"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab as any)}
            className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === tab
                ? "border-[var(--acc-clr)] text-[var(--prof-clr)]"
                : "border-transparent text-[var(--bg-clr)]"
              }`}
          >
            {tab === "pending orders"
              ? "Orders"
              : tab === "active"
                ? "Active Orders"
                : "Delivered Orders"}
          </button>
        ))}
      </div>
    </div>
  );
}