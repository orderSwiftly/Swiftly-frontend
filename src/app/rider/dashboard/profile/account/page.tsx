"use client";
import { fetchRiderDetails, uploadProfile } from "@/lib/rider";
import { useEffect, useState, useRef } from "react";
import Spinner from "@/components/pulse-loader";
import { User, Mail, Building2, CircleDot, Camera, Star } from "lucide-react";

interface RiderDetails {
  user_data: {
    name: string;
    email: string;
    photo?: string | null;
    institution: {
      id: string;
      name: string;
    };
    bank_details?: {
      account_number: string;
      bank_name: string;
      account_name: string;
    };
    rating: {
      average: number;
      count: number;
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
    let timeoutId: NodeJS.Timeout;
    
    const load = async () => {
      try {
        timeoutId = setTimeout(() => {
          setError("Request timed out. Please check your connection.");
          setLoading(false);
        }, 10000);

        const riderData = await fetchRiderDetails();
        clearTimeout(timeoutId);
        
        setRider(riderData);
        setPhoto(riderData.user_data.photo || null);
      } catch (err) {
        clearTimeout(timeoutId);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    load();
    return () => clearTimeout(timeoutId);
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
      setRider(prev => prev ? {
        ...prev,
        user_data: { ...prev.user_data, photo: res.data.photo }
      } : null);
    } catch {
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center sec-ff w-full justify-center py-10 gap-3">
        <Spinner />
        <p className="text-sm text-(--sec-clr)">Loading profile...</p>
      </div>
    );
  }
  
  if (error) return (
    <div className="flex flex-col items-center sec-ff w-full justify-center py-10 gap-3">
      <p className="text-sm text-red-400">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 text-sm bg-(--pry-clr) text-(--bg-clr) rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
  
  if (!rider) return <p className="text-sm text-(--sec-clr) sec-ff">No rider data found.</p>;

  const isAvailable = rider.rider_data.status === "available";
  const ratings = rider.user_data.rating;

  return (
    <main className="p-4 space-y-5 mb-20">

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
        
        {/* Ratings display - always show */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold sec-ff text-(--txt-clr)">
              {ratings ? ratings.average.toFixed(1) : "0.0"}
            </span>
          </div>
          <span className="text-xs sec-ff text-(--sec-clr)">
            ({ratings ? ratings.count : 0} {ratings && ratings.count === 1 ? 'rating' : 'ratings'})
          </span>
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
        <p className="text-base font-medium sec-ff text-(--pry-clr)">Profile Details</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f5f5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-(--prof-clr)">
              <User size={16} className="text-(--txt-clr)" />
            </div>
            <div>
              <p className="text-xs sec-ff text-(--sec-clr)">Full Name</p>
              <p className="text-sm font-medium sec-ff text-(--pry-clr)">{rider.user_data.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f5f5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-(--prof-clr)">
              <Mail size={16} className="text-(--txt-clr)" />
            </div>
            <div>
              <p className="text-xs sec-ff text-(--sec-clr)">Email</p>
              <p className="text-sm font-medium sec-ff text-(--pry-clr)">{rider.user_data.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f5f5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-(--prof-clr)">
              <Building2 size={16} className="text-(--txt-clr)" />
            </div>
            <div>
              <p className="text-xs sec-ff text-(--sec-clr)">Institution</p>
              <p className="text-sm font-medium sec-ff text-(--pry-clr)">{rider.user_data.institution.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Summary Card - always show */}
      <div className="rounded-2xl bg-(--txt-clr) p-5 space-y-2">
        <p className="text-base font-medium sec-ff text-(--pry-clr) flex items-center gap-2">
          <Star size={18} className="fill-yellow-400 text-yellow-400" />
          Ratings & Reviews
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold sec-ff text-(--wave-clr)">
            {ratings ? ratings.average.toFixed(1) : "0.0"}
          </p>
          <p className="text-sm sec-ff text-(--sec-clr)">/ 5.0</p>
        </div>
        <p className="text-sm sec-ff text-(--sec-clr)">
          Based on {ratings ? ratings.count : 0} {ratings && ratings.count === 1 ? 'rating' : 'ratings'}
        </p>
      </div>

      {/* Active orders */}
      <div className="rounded-2xl bg-(--txt-clr) p-5 space-y-2">
        <p className="text-base font-medium sec-ff text-(--pry-clr)">Active Orders</p>
        <p className="text-3xl font-bold sec-ff text-(--wave-clr)">
          {rider.rider_data.active_order_ids.length}
        </p>
        <p className="text-sm sec-ff text-((--sec-clr)">
          {rider.rider_data.active_order_ids.length === 0
            ? "No active orders at the moment"
            : "Orders currently in progress"}
        </p>
      </div>

    </main>
  );
}