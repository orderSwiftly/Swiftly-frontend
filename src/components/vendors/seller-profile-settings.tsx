"use client";

import { useEffect, useRef, useState } from "react";
import { User, Camera, MapPin } from "lucide-react";
import { GetProfile } from "@/lib/get-profile";
import { AdditionalInfo } from "@/lib/additional-info";
import PulseLoader from "../pulse-loader";
import toast from "react-hot-toast";
import Image from "next/image";

type SettingsFormData = {
    name: string;
    email: string;
    phoneNumber: string;
    seller_address: string;
    photo?: File;
};

export default function ProfileSettings() {
    const [formData, setFormData] = useState<SettingsFormData>({
        name: "",
        email: "",
        phoneNumber: "",
        seller_address: "",
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        (async () => {
            const user = await GetProfile();
            if (user) {
                setFormData({
                    name: user.businessName || "",
                    email: user.email || "",
                    phoneNumber: user.phoneNumber || "",
                    seller_address: user.seller_address || "",
                });
                if (user.logo) setPreview(user.logo);
            }
        })();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await AdditionalInfo(formData);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">

            {/* ── Profile header ──────────────────────────── */}
            <div className="flex items-center gap-4 mb-8">

                {/* Avatar */}
                <div className="relative group w-16 h-16 shrink-0">
                    {preview ? (
                        <Image
                            width={64}
                            height={64}
                            src={preview}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#9BDD37]"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-[#9BDD37]/10 ring-2 ring-[#9BDD37]/40 rounded-full flex items-center justify-center">
                            <User size={24} className="text-[#9BDD37]" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                        <Camera size={16} className="text-white" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[#669917] pry-ff">
                        Profile Information
                    </h2>
                    <p className="text-[#c0c0c0] sec-ff text-sm mt-0.5">
                        Update your phone number, address and profile picture.
                    </p>
                </div>
            </div>

            {/* ── Form ────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Full Name — read only */}
                    <div>
                        <label className="block text-xs font-semibold text-[#c0c0c0] sec-ff mb-1.5 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            readOnly
                            className="w-full px-4 py-2.5 bg-[#f5f5f5] rounded-xl text-[var(--sec-clr)] sec-ff text-sm focus:outline-none border border-[#e8e8e8] cursor-not-allowed"
                        />
                    </div>

                    {/* Email — read only */}
                    <div>
                        <label className="block text-xs font-semibold text-[#c0c0c0] sec-ff mb-1.5 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-4 py-2.5 bg-[#f5f5f5] border border-[#e8e8e8] rounded-xl text-[#c0c0c0] sec-ff text-sm cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Phone Number — editable */}
                <div>
                    <label className="block text-xs font-semibold text-[#c0c0c0] sec-ff mb-1.5 uppercase tracking-wider">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2.5 bg-white border border-[#e8e8e8] rounded-xl text-[#0A0F1A] sec-ff text-sm focus:outline-none focus:ring-2 focus:ring-[#9BDD37]/40 focus:border-[#9BDD37] transition placeholder:text-[#c0c0c0]"
                    />
                </div>

                {/* Seller Address — editable */}
                <div>
                    <label className="block text-xs font-semibold text-[#c0c0c0] sec-ff mb-1.5 uppercase tracking-wider">
                        Seller Address
                    </label>
                    <div className="relative">
                        <MapPin
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#669917] pointer-events-none"
                        />
                        <input
                            type="text"
                            name="seller_address"
                            value={formData.seller_address}
                            onChange={handleChange}
                            placeholder="Enter your pickup address"
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8e8e8] rounded-xl text-[#0A0F1A] sec-ff text-sm focus:outline-none focus:ring-2 focus:ring-[#9BDD37]/40 focus:border-[#9BDD37] transition placeholder:text-[#c0c0c0]"
                        />
                    </div>
                </div>

                {/* Photo upload trigger */}
                <div>
                    <label className="block text-xs font-semibold text-[#c0c0c0] sec-ff mb-1.5 uppercase tracking-wider">
                        Profile Photo
                    </label>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#9BDD37]/50 rounded-xl text-sm text-[#669917] hover:border-[#9BDD37] hover:bg-[#9BDD37]/5 transition sec-ff"
                    >
                        <Camera size={15} />
                        {preview ? "Change Photo" : "Upload Photo"}
                    </button>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#006B4F] text-white rounded-xl sec-ff font-semibold text-sm hover:bg-[#005a42] transition disabled:opacity-50"
                    >
                        {loading ? <PulseLoader /> : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}