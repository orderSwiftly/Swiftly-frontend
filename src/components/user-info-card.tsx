"use client";

import { useUserStore } from "@/stores/userStore";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { fetchCurrentInstitution, Institution } from '@/lib/campus';
import { useUIStore } from "@/stores/campusStore";
import { useEffect, useState } from "react";

export default function UserInfoCard() {
  const { user } = useUserStore();
  const { openCampus } = useUIStore();

  const [institution, setInstitution] = useState<Institution | null>(null);

  // Fetch current campus/institution
  useEffect(() => {
    const loadInstitution = async () => {
      try {
        const inst = await fetchCurrentInstitution();
          if (inst) setInstitution(inst);
      } catch (err) {
        console.error('Failed to load institution', err);
      }
    };
  
    loadInstitution();
  }, []);

  const maskPhone = (phone?: string) => {
    if (!phone) return "+2348******5678";
    if (phone.length <= 6) return phone;
    const visible = phone.slice(0, 5);
    const masked = "*".repeat(6);
    const last4 = phone.slice(-4);
    return `${visible}${masked}${last4}`;
  };

  return (
    <div className="w-full bg-white px-4 pt-2 pb-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium text-[#0A0A0A]">
          {user?.fullname || "User"}
        </h2>
        <p className="text-xs text-[#7A7A7A]">{maskPhone(user?.phone)}</p>
      </div>

      <div className="flex items-center justify-between bg-[#E1E1E1] rounded-xl px-3 py-2.5">
        <div className="text-sm text-gray-700">
          {institution?.name || "No campus selected"}
        </div>
        <Link href="/dashboard/profile/edit">
          <GraduationCap className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
        </Link>
      </div>
    </div>
  );
}
