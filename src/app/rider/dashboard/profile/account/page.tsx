"use client";
import { fetchRiderDetails, uploadProfile } from "@/lib/rider";
import { useEffect, useState, useRef } from "react";
import Spinner from "@/components/pulse-loader";
import { User, Mail, Building2, CircleDot, Camera } from "lucide-react";

interface RiderDetails {
  user_data: {
    name: string;
    email: string;
    photo?: string;
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
  const [uploading, setUploading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRiderDetails();
        setRider(data);
        setPhoto(data.user_data.photo || null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be under 5MB");
      return;
    }
    try {
      setUploading(true);
      const res = await uploadProfile(file);
      setPhoto(res.data.photo);
    } catch {
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center sec-ff w-full justify-center py-10">
        <Spinner />
      </div>
    );
  }
  if (error) return <p className="text-sm text-red-400 sec-ff">{error}</p>;
  if (!rider) return <p className="text-sm text-(--sec-clr) sec-ff">No rider data found.</p>;

  const isAvailable = rider.rider_data.status === "available";

  return (
    <main className="p-4 space-y-5">

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 py-6 rounded-2xl bg-(--bg-clr)">
        <div
          className="relative w-20 h-20 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 rounded-full bg-(--acc-clr) flex items-center justify-center overflow-hidden">
            {uploading ? (
              <Spinner />
            ) : photo ? (
              <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold sec-ff text-(--pry-clr)">
                {rider.user_data.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-(--pry-clr) flex items-center justify-center">
            <Camera size={12} color="#9BDD37" />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

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