// src/components/riders/deliver-order.tsx

"use client";

import { deliverOrder } from "@/lib/rider-order";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import PulseLoader from "../pulse-loader";

export default function DeliverOrderButton({
    orderId,
    onSuccess,
    onError,
}: {
    orderId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    const handleDeliver = async () => {
        setLoading(true);
        try {
            await deliverOrder(orderId);
            onSuccess();
        } catch (e: unknown) {
            onError(e instanceof Error ? e.message : "Failed to deliver order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDeliver}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#006B4F] hover:bg-[#005540] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
            {loading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <CheckCircle2 size={14} />
            )}
            {loading ? <PulseLoader /> : "Mark as Delivered"}
        </button>
    );
}