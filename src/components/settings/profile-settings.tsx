"use client";

import { useEffect, useRef, useState } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import { GetProfile } from "@/lib/get-profile";
import { AdditionalInfo } from "@/lib/additional-info";
import PulseLoader from "../pulse-loader";
import toast from "react-hot-toast";

type SettingsFormData = {
  name: string;
  email: string;
  bio: string;
  phoneNumber: string;  // ✅ Use phoneNumber
  gender: string;
  photo?: File;
};

const optimizeCloudinaryUrl = (url: string) =>
  url.replace("/upload/", "/upload/q_auto,f_auto,w_64/");

export default function ProfileSettings() {
  const [formData, setFormData] = useState<SettingsFormData>({
    name: "",
    email: "",
    bio: "",
    phoneNumber: "",  // ✅ Use phoneNumber
    gender: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      const user = await GetProfile();
      if (user) {
        setFormData({
          name: user.fullname || "",
          email: user.email || "",
          bio: "",
          phoneNumber: user.phoneNumber || "",  // ✅ Direct mapping
          gender: user.gender || "",
        });
        if (user.photo) setPreview(optimizeCloudinaryUrl(user.photo));
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setImgError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (formData.photo) setPhotoLoading(true);

      const updateData = {
        phoneNumber: formData.phoneNumber,  // ✅ Send phoneNumber
        gender: formData.gender,
        photo: formData.photo,
      };

      const updatedUser = await AdditionalInfo(updateData);

      if (updatedUser?.photo) {
        setPreview(optimizeCloudinaryUrl(updatedUser.photo));
      }

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
      setPhotoLoading(false);
    }
  };

  return (
    <div className="p-6">

      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">

        {/* Avatar */}
        <div className="relative group w-16 h-16 shrink-0">
          {photoLoading ? (
            <div className="w-16 h-16 rounded-full bg-[#9BDD37]/10 ring-2 ring-[#9BDD37]/40 flex items-center justify-center">
              <Loader2 size={20} className="text-[#9BDD37] animate-spin" />
            </div>
          ) : preview && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Profile"
              onError={() => setImgError(true)}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#9BDD37]"
            />
          ) : (
            <div className="w-16 h-16 bg-[#9BDD37]/10 ring-2 ring-[#9BDD37]/40 rounded-full flex items-center justify-center">
              <User size={24} className="text-[#9BDD37]" />
            </div>
          )}
          {!photoLoading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            >
              <Camera size={16} className="text-white" />
            </button>
          )}
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
            Update your phone number and profile picture.
          </p>
        </div>
      </div>

      {/* Form */}
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
              className="w-full px-4 py-2.5 bg-[#f5f5f5] border border-[#e8e8e8] rounded-xl text-[#c0c0c0] sec-ff text-sm cursor-not-allowed"
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
            type="tel"
            name="phoneNumber"  // ✅ Use phoneNumber
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2.5 bg-white border border-[#e8e8e8] rounded-xl text-[#0A0F1A] sec-ff text-sm focus:outline-none focus:ring-2 focus:ring-[#9BDD37]/40 focus:border-[#9BDD37] transition placeholder:text-[#c0c0c0]"
          />
        </div>

        {/* Gender — dropdown */}
        <div>
          <label className="block text-xs font-semibold text-[#c0c0c0] sec-ff mb-1.5 uppercase tracking-wider">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-[#e8e8e8] rounded-xl text-[#0A0F1A] sec-ff text-sm focus:outline-none focus:ring-2 focus:ring-[#9BDD37]/40 focus:border-[#9BDD37] transition cursor-pointer"
          >
            <option value="">-- Select gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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
            {preview && !imgError ? "Change Photo" : "Upload Photo"}
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