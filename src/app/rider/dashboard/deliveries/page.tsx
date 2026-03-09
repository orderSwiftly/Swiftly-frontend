// src/app/rider/dashboard/deliveries/page.tsx
"use client";

import { useState } from "react";
import NearestOrders from "@/components/riders/nearest-orders";
import ActiveOrders from "@/components/riders/active-orders";
import DeliveredOrders from "@/components/riders/delivered-orders";

type TopTab = "pending" | "active" | "passive";

export default function DeliveryPage() {
    const [activeTab, setActiveTab] = useState<TopTab>("pending");

    return (
        <main className="px-4 py-5 sec-ff">
            {/* Top-level tab bar */}
            <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-xl mb-6">
                {(["pending", "active", "passive"] as TopTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer capitalize ${activeTab === tab
                                ? "bg-white text-[#0A0F1A] shadow-sm"
                                : "text-[#c0c0c0] hover:text-[#0A0F1A]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "pending" && <NearestOrders />}
            {activeTab === "active" && <ActiveOrders />}
            {activeTab === "passive" && <DeliveredOrders />}
        </main>
    );
}