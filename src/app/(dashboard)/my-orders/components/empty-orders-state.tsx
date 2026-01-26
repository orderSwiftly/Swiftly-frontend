"use client";

import no_orders from "../../../../../public/no_orders.png";

export default function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-48 h-48 mb-6">
        <div className="absolute inset-0 bg-gray-100 rounded-full opacity-50" />

        <div className="absolute inset-0 flex items-center justify-center">
          <img src={no_orders.src} alt="No Orders" />
        </div>
      </div>

      <p className="text-[#9C9C9C] text-xl">No Orders Yet</p>
    </div>
  );
}
