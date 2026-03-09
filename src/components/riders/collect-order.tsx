// src/components/riders/collect-order.tsx

"use client";

import { collectOrder } from "@/lib/rider-order";
import { useState } from "react";
import { Loader2, PackageCheck } from "lucide-react";
import PulseLoader from "../pulse-loader";

export default function CollectOrderButton({
    orderId,
    onSuccess,
    onError,
}: {
    orderId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    const handleCollect = async () => {
        setLoading(true);
        try {
            await collectOrder(orderId);
            onSuccess();
        } catch (e: unknown) {
            onError(e instanceof Error ? e.message : "Failed to collect order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCollect}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--bg-clr)] hover:bg-[#8acc2a] disabled:opacity-60 text-[var(--txt-clr)] text-sm font-semibold transition-colors cursor-pointer"
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <PackageCheck size={14} />}
            {loading ? <PulseLoader /> : "Collect Order"}
        </button>
    );
}