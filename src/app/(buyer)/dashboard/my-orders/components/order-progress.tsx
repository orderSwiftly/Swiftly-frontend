// src/app/(buyer)/dashboard/my-orders/components/order-progress.tsx

interface OrderProgressProps {
    filled: number;
}

export default function OrderProgress({ filled }: Readonly<OrderProgressProps>) {
    const TOTAL_DOTS = 6;

    return (
        <div className="flex w-full gap-2">
            {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
                <span
                    key={i}
                    className={`h-3.5 flex-1 rounded-full transition-colors ${i < filled ? "bg-[var(--prof-clr)]" : "bg-gray-400/40"
                        }`}
                />
            ))}
        </div>
    );
}
