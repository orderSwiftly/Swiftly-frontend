// src/components/riders/unclaim-orders.tsx
"use client";

import { unclaimOrder } from "@/lib/rider-order";
import { useState } from "react";
import { Loader2, HandshakeIcon } from "lucide-react";

export default function UnclaimOrderButton({
    orderId,
    onSuccess,
    onError,
}: Readonly<{
    orderId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}>) {
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        setLoading(true);
        try {
            await unclaimOrder(orderId);
            onSuccess();
        } catch (e: unknown) {
            onError(e instanceof Error ? e.message : "Failed to unclaim order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRequest}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--prof-clr)] hover:bg-[var(--wave-clr)] disabled:opacity-60 text-[var(--txt-clr)] text-sm font-semibold transition-colors cursor-pointer"
        >
            <Loader2 size={14} className={loading ? "animate-spin" : "hidden"} />
            {!loading && <HandshakeIcon size={14} />}
            {loading ? "Unclaiming..." : "Unclaim Order"}
        </button>
    );
}