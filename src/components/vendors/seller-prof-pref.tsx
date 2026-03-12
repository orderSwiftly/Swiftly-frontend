"use client";

import { useState } from "react";
import { Bell, HelpCircle, Copy, ChevronRight, LogOut } from "lucide-react";
import LogoutModal from "@/components/logout-modal";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";
import toast from "react-hot-toast";
import OneSignal from "react-onesignal";

export default function ProfilePreference() {
  const { logout, user } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const userId = user?._id;

  const handleCopyReferralCode = () => {
    const referralCode = user?.referralCode || "SWIFT12345";
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleNotifications = async () => {
    if (!userId) return;

    try {
      if (notificationsEnabled) {
        await OneSignal.logout();
        setNotificationsEnabled(false);
        toast.success("Notifications unsubscribed.");
      } else {
        const permission = await OneSignal.Notifications.requestPermission();
        if (permission) {
          await OneSignal.login(userId);
          setNotificationsEnabled(true);
          toast.success("Notifications subscribed.");
        } else {
          toast.error("Permission denied. Cannot subscribe to notifications.");
        }
      }
    } catch (err) {
      console.error("OneSignal toggle failed:", err);
      toast.error("Failed to toggle notifications.");
    }
  };

  return (
    <>
      <section className="px-4 mt-4 w-full pb-24 md:pb-10">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Preferences
        </h3>

        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {/* Push Notifications Toggle */}
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
              className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? "bg-green-600" : "bg-gray-300"
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          {/* Support */}
          <Link
            href="/seller/dashboard/profile/support"
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

          {/* Referral Code */}
          <button
            onClick={handleCopyReferralCode}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                <Copy className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Copy Referral Code
              </span>
            </div>
            <Copy className={`w-4 h-4 ${copiedCode ? "text-green-600" : "text-gray-400"}`} />
          </button>

          {/* Logout */}
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