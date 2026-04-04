// src/components/riders/get-earnings.tsx

"use client";

import { useEffect, useState } from "react";
import { getEarnings, EarningsData } from "@/lib/rider";
import EarningSkeleton from "@/components/riders/earning-skeleton";

export default function GetEarnings() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEarnings()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });

  if (loading) return <EarningSkeleton />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-4 sec-ff">
      <div className="relative overflow-hidden rounded-xl border border-border p-4" style={{ background: "#ffffff" }}>
        {/* Wave decoration */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <svg viewBox="0 0 400 180" className="absolute top-0 right-0 w-full opacity-100" preserveAspectRatio="xMaxYMin slice">
            <path d="M200,0 Q280,40 400,20 L400,0 Z" fill="#3a7d0a" opacity="0.9" />
            <path d="M160,0 Q260,60 400,35 L400,0 Z" fill="#4e9c0e" opacity="0.7" />
            <path d="M220,0 Q320,50 400,55 L400,0 Z" fill="#6abf1a" opacity="0.5" />
          </svg>
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground relative z-10 mb-3">
          Recent payouts
        </p>
        <div className="relative z-10">
          {data.recentPayouts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent payouts</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentPayouts.map((payout, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm">{payout.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payout.date).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{fmt(payout.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total earnings" value={fmt(data.totalEarnings)} />
        <StatCard label="Today's orders" value={String(data.todayOrders)} sub="today" />
        <StatCard label="Today's earnings" value={fmt(data.todayEarnings)} />
        <StatCard label="Total orders" value={String(data.totalOrders)} sub="all time" />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}