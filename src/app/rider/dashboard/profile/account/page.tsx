"use client";
import { fetchRiderDetails } from "@/lib/rider";
import { useEffect, useState } from "react";
import Spinner from "@/components/pulse-loader";
import { User, Mail, Building2, CircleDot } from "lucide-react";

interface RiderDetails {
  user_data: {
    name: string;
    email: string;
    institution: {
      id: string;
      name: string;
    };
  };
  rider_data: {
    status: string;
    active_order_ids: string[];
  };
}

export default function RiderAccount() {
  const [rider, setRider] = useState<RiderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRiderDetails();
        setRider(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

    if (loading) {
        return (
            <div className="flex items-center sec-ff w-full justify-center py-10">
                <Spinner />
            </div>
        )
    }
  if (error) return <p className="text-sm text-red-400 sec-ff">{error}</p>;
  if (!rider) return <p className="text-sm text-(--sec-clr) sec-ff">No rider data found.</p>;

  const isAvailable = rider.rider_data.status === "available";

  return (
    <main className="p-4 space-y-5">

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 py-6 rounded-2xl bg-(--bg-clr)">
        <div className="w-20 h-20 rounded-full bg-(--acc-clr) flex items-center justify-center">
          <span className="text-3xl font-bold sec-ff text-(--pry-clr)">
            {rider.user_data.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold sec-ff text-(--txt-clr)">{rider.user_data.name}</p>
          <p className="text-sm sec-ff text-(--sec-clr)">{rider.user_data.email}</p>
        </div>
        <span
          className={`text-sm px-3 py-1 rounded-full sec-ff flex items-center gap-1 ${
            isAvailable ? "bg-green-900 text-green-400" : "bg-yellow-900 text-yellow-400"
          }`}
        >
          <CircleDot size={13} />
          {isAvailable ? "Available" : "In Transit"}
        </span>
      </div>

      {/* Details */}
      <div className="rounded-2xl bg-(--txt-clr) p-5 space-y-4">
        <p className="text-base font-medium sec-ff text-(--pry-clr)">Account Details</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f5f5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-(--bg-clr)">
              <User size={16} color="#9BDD37" />
            </div>
            <div>
              <p className="text-xs sec-ff text-(--sec-clr)">Full Name</p>
              <p className="text-sm font-medium sec-ff text-(--pry-clr)">{rider.user_data.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f5f5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-(--bg-clr)">
              <Mail size={16} color="#9BDD37" />
            </div>
            <div>
              <p className="text-xs sec-ff text-(--sec-clr)">Email</p>
              <p className="text-sm font-medium sec-ff text-(--pry-clr)">{rider.user_data.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f5f5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-(--bg-clr)">
              <Building2 size={16} color="#9BDD37" />
            </div>
            <div>
              <p className="text-xs sec-ff text-(--sec-clr)">Institution</p>
              <p className="text-sm font-medium sec-ff text-(--pry-clr)">{rider.user_data.institution.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active orders */}
      <div className="rounded-2xl bg-(--txt-clr) p-5 space-y-2">
        <p className="text-base font-medium sec-ff text-(--pry-clr)">Active Orders</p>
        <p className="text-3xl font-bold sec-ff text-(--bg-clr)">
          {rider.rider_data.active_order_ids.length}
        </p>
        <p className="text-sm sec-ff text-(--sec-clr)">
          {rider.rider_data.active_order_ids.length === 0
            ? "No active orders at the moment"
            : "Orders currently in progress"}
        </p>
      </div>

    </main>
  );
}