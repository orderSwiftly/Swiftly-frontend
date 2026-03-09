// src/app/rider/dashboard/deliveries/page.tsx

// src/app/rider/dashboard/deliveries/page.tsx

"use client";

import { useState } from "react";
import NearestOrders from "@/components/riders/nearest-orders";
import ClaimedOrders from "@/components/riders/claimed-orders";
import CollectedOrders from "@/components/riders/collected-orders";
import DeliveredOrders from "@/components/riders/delivered-orders";

const TABS = [
    { id: "nearby", label: "Nearby" },
    { id: "claimed", label: "Claimed" },
    { id: "transit", label: "In Transit" },
    { id: "completed", label: "Completed" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function DeliveryPage() {
    const [activeTab, setActiveTab] = useState<Tab>("nearby");

    return (
        <main className="px-4 py-5 sec-ff">
            {/* Tab bar */}
            <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-fit whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab.id
                                ? "bg-white text-[#0A0F1A] shadow-sm"
                                : "text-[#c0c0c0] hover:text-[#0A0F1A]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab panels */}
            {activeTab === "nearby" && <NearestOrders />}
            {activeTab === "claimed" && <ClaimedOrders />}
            {activeTab === "transit" && <CollectedOrders />}
            {activeTab === "completed" && <DeliveredOrders />}
        </main>
    );
}