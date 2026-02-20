"use client";

import { useState } from "react";
import { ShipOrders } from "@/lib/ship";

interface ShipButtonProps {
    orderId: string;
    canShip: boolean;
    onShipped?: () => void;
}

export default function ShipButton({ orderId, canShip, onShipped }: ShipButtonProps) {
    const [loading, setLoading] = useState(false);
    const [shipped, setShipped] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isDisabled = !canShip || loading || shipped;

    const handleShip = async () => {
        if (isDisabled) return;

        setLoading(true);
        setErrorMsg(null);

        try {
            await ShipOrders(orderId);
            setShipped(true);
            if (onShipped) onShipped();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Error shipping order";
            setErrorMsg(message);
            console.error("Shipping failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const label = loading
        ? "Shipping..."
        : shipped || !canShip
            ? "Shipped ✓"
            : "Ship Items";

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={handleShip}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors
          ${isDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[var(--prof-clr)] text-white hover:bg-green-700"
                    }`}
            >
                {label}
            </button>
            {errorMsg && (
                <p className="text-xs text-red-500">{errorMsg}</p>
            )}
        </div>
    );
}