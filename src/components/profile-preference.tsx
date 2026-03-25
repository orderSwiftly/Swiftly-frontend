// src/components/profile-preference.tsx

"use client";

import { Bell, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import LogoutModal from "./logout-modal";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";
import { NotificationToggle } from "./notification-toggle";

export default function ProfilePreference() {
  const { logout } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <section className="px-4 mt-4 w-full pb-24 md:pb-10">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Preferences
        </h3>

        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          <div className="w-full flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Push Notifications
              </span>
            </div>

            {/* ✅ Replaces the old local-state-only button */}
            <NotificationToggle />
          </div>

          <Link
            href="/dashboard/profile/support"
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Contact support
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">Log Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </section>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onLogout={logout}
        />
      )}
    </>
  );
}