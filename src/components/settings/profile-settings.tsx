"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { GetProfile } from "@/lib/get-profile";
import { AdditionalInfo } from "@/lib/additional-info";
import PulseLoader from "../pulse-loader";
import toast from "react-hot-toast";
import Image from "next/image";

type SettingsFormData = {
  name: string;
  email: string;
  bio: string;
  phoneNumber: string;
  photo?: File;
};

export default function ProfileSettings() {
  const [formData, setFormData] = useState<SettingsFormData>({
    name: "",
    email: "",
    bio: "",
    phoneNumber: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await GetProfile();
      if (user) {
        setFormData({
          name: user.fullname || "",
          email: user.email || "",
          bio: "",
          phoneNumber: user.phoneNumber || "",
        });
        if (user.photo) setPreview(user.photo);
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
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        {preview ? (
          <Image
            width={64}
            height={64}
            src={preview}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-[var(--acc-clr)] rounded-full flex items-center justify-center">
            <User size={24} className="text-[var(--txt-clr)]" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff">
            Profile Information
          </h2>
          <p className="text-[var(--txt-clr)] sec-ff">
            Update your phone number and profile picture.
          </p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-[var(--txt-clr)]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-[var(--txt-clr)]"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-[var(--txt-clr)]"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">
            Profile Photo
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[var(--acc-clr)] text-[var(--bg-clr)] rounded-md hover:opacity-90"
        >
          {loading ? <PulseLoader /> : "Update Profile"}
        </button>
      </form>
    </div>
  );
}