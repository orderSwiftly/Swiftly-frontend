// src/components/profile-preference

"use client";

import { Bell, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import LogoutModal from "./logout-modal";
import { useUserStore } from "@/stores/userStore";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ProfilePreference() {
  const { logout } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { enabled, loading, toggleNotifications } = usePushNotifications();

  const handleLogout = async () => {
    await logout();
    // Don't unsubscribe on logout - keep subscription for next login
    toast.success("Logged out successfully");
  };

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

            <button
              onClick={toggleNotifications}
              disabled={loading}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                enabled ? "bg-green-600" : "bg-gray-300"
              } disabled:opacity-50`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
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
          onLogout={handleLogout}
        />
      )}
    </>
  );
}