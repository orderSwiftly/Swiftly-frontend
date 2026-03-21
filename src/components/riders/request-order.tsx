// src/components/riders/request-order.tsx

"use client";

import { requestOrder } from "@/lib/rider-order";
import { useState } from "react";
import { Loader2, HandshakeIcon } from "lucide-react";
import PulseLoader from "../pulse-loader";

export default function RequestOrderButton({
    orderId,
    onSuccess,
    onError,
}: {
    orderId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        setLoading(true);
        try {
            await requestOrder(orderId);
            onSuccess();
        } catch (e: unknown) {
            onError(e instanceof Error ? e.message : "Failed to request order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRequest}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--bg-clr)] hover:bg-[#8acc2a] disabled:opacity-60 text-[var(--txt-clr)] text-sm font-semibold transition-colors cursor-pointer"
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <HandshakeIcon size={14} />}
            {loading ? <PulseLoader /> : "Request Pickup"}
        </button>
    );
}