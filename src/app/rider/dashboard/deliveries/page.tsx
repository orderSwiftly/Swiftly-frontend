// src/app/rider/dashboard/deliveries/page.tsx

import NearestOrders from "@/components/riders/nearest-orders"

export default function DeliveryPage() {
    return (
        <main className="px-4 py-5">
            <NearestOrders />
        </main>
    )
}