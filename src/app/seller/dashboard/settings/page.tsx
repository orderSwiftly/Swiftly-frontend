"use client";

import { useState } from "react";
import AccountSettings from "@/components/settings/account-settings";
import SellerProfileSettings from "@/components/vendors/seller-profile-settings";
import { User, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

const tabs = [
    {
        id: "profile",
        label: "Profile",
        icon: User,
        description: "Photo, name & contact",
    },
    {
        id: "account",
        label: "Account",
        icon: Settings,
        description: "Password & security",
    },
];

// Minimal stub so AccountSettings renders without prop errors
const defaultFormData = {
    name: "",
    email: "",
    phone: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    emailNotifications: false,
    pushNotifications: false,
    marketingEmails: false,
    twoFactorEnabled: false,
};

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState(defaultFormData);

    const handleInputChange = (field: string, value: string | boolean) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const handleSave = (section: string) => {
        console.log("Saving section:", section, formData);
    };

    return (
        <div className="min-h-screen bg-[var(--txt-clr)] py-10 px-4 mb-10">
            {/* Page header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center gap-2 text-xs text-[var(--bg-clr)]/50 sec-ff mb-3">
                    <Link href="/dashboard/profile" className="hover:underline">Profile</Link>
                    <ChevronRight size={12} />
                    <span className="text-[var(--acc-clr)]">My Account</span>
                </div>
                <h1 className="text-3xl font-bold text-[var(--acc-clr)] pry-ff tracking-tight">
                    My Account
                </h1>
                <p className="text-[var(--pry-clr)] sec-ff mt-1">
                    Manage your profile, security, and account preferences.
                </p>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
                {/* Sidebar nav */}
                <aside className="md:w-56 shrink-0">
                    <nav className="flex flex-row md:flex-col gap-2">
                        {tabs.map(({ id, label, icon: Icon, description }) => {
                            const active = activeTab === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`
                    w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${active
                                            ? "bg-[var(--acc-clr)]/10 border border-[var(--acc-clr)]/30 shadow-sm"
                                            : "hover:bg-white/5 border border-transparent"
                                        }
                  `}
                                >
                                    <div
                                        className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${active ? "bg-[var(--acc-clr)] text-[var(--bg-clr)]" : "bg-[var(--bg-clr)]/10 text-[var(--prof-clr)]/60"}
                  `}
                                    >
                                        <Icon size={15} />
                                    </div>
                                    <div className="hidden md:block overflow-hidden">
                                        <p
                                            className={`text-sm font-semibold pry-ff truncate ${active ? "text-[var(--acc-clr)]" : "text-[var(--bg-clr)]"}`}
                                        >
                                            {label}
                                        </p>
                                        <p className="text-xs text-[var(--bg-clr)]/50 sec-ff truncate">
                                            {description}
                                        </p>
                                    </div>
                                    {/* Mobile-only label */}
                                    <span className="md:hidden text-sm font-semibold pry-ff text-[var(--bg-clr)]">
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content panel */}
                <div className="flex-1 min-w-0">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
                        {/* Panel top accent bar */}
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--acc-clr)]/60 to-transparent" />

                        {activeTab === "profile" && <SellerProfileSettings />}

                        {activeTab === "account" && (
                            <AccountSettings
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSave={handleSave}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}