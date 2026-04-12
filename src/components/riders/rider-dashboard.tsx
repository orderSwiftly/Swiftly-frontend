// src/components/riders/rider-dashboard.tsx
import EarningCard from "./get-earnings";
import DeliveryWindow from "./delivery-window";

export default function RiderDashboard() {
    return (
        <div className="min-h-screen bg-gray-100 sec-ff">
            <main className="p-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Earnings Section - takes 1/3 on large screens */}
                    <div className="lg:col-span-1">
                        <EarningCard />
                    </div>
                    
                    {/* Delivery Windows Section - takes 2/3 on large screens */}
                    <div className="lg:col-span-2">
                        <DeliveryWindow />
                    </div>
                </div>
                
                {/* Optional: Add more rider-specific content below */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Active Deliveries</h3>
                        <p className="text-gray-500 text-sm">No active deliveries at the moment.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
                        <p className="text-gray-500 text-sm">Your recent deliveries will appear here.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}