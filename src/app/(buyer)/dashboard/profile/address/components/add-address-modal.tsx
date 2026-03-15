"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PulseLoader from "@/components/pulse-loader";

interface AddAddressModalProps {
  onClose: () => void;
  onAdd: (address: { building: string; room: string }) => void;
}

export default function AddAddressModal({ onClose, onAdd }: AddAddressModalProps) {
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!building.trim() || !room.trim()) return;

    const token = localStorage.getItem("token");
    const api_url = process.env.NEXT_PUBLIC_API_URL;

    setLoading(true);
    try {
      const res = await fetch(`${api_url}/api/v1/user/add-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ building, room }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message ?? "Failed to add address");
        return;
      }

      toast.success("Address added successfully");
      onAdd({ building, room });
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-[#101828] text-center mb-6">
          Add Address
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-[#344054] font-medium mb-2">
              Building/Hall Name
            </label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="e.g. Winslow Hall/New Horizon"
              className="w-full px-3 py-2.5 bg-gray-50 border border-[var(--bg-clr)] rounded-lg text-sm text-[#344054] focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm text-[#344054] font-medium mb-2">
              Room/Office
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. C20, Room 1"
              className="w-full px-3 py-2.5 bg-gray-50 border border-[var(--bg-clr)] rounded-lg text-sm text-[#344054] focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-[var(--txt-clr)] bg-[var(--sec-clr)] text-sm font-medium rounded-lg hover:bg-gray-500 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            disabled={!building.trim() || !room.trim() || loading}
            className="flex-1 py-2.5 bg-[var(--prof-clr)] text-[var(--txt-clr)] text-sm font-medium rounded-lg hover:bg-[#4a6d0d] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            {loading ? <PulseLoader /> : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}