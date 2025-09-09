"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { GetProfile } from "@/lib/get-profile";

type SettingsFormData = {
  name: string;
  email: string;
  bio: string;
};

export default function ProfileSettings() {
  const [formData, setFormData] = useState<SettingsFormData>({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    (async () => {
      const user = await GetProfile();
      if (user) {
        setFormData({
          name: user.fullname || "",
          email: user.email || "",
          bio: "", // since backend doesn't send it
        });
      }
    })();
  }, []);

  return (
    <div className="p-6">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-[var(--acc-clr)] rounded-full flex items-center justify-center">
          <User size={24} className="text-[var(--txt-clr)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff">
            Profile Information
          </h2>
          <p className="text-[var(--txt-clr)] sec-ff">
            This information is fetched from your account.
          </p>
        </div>
      </div>

      {/* Profile form */}
      <div className="space-y-6">
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

        {/* Bio (static placeholder, since backend doesn’t send it yet) */}
        <div>
          <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">
            Bio
          </label>
          <textarea
            value={formData.bio}
            readOnly
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-[var(--txt-clr)] resize-none"
            placeholder="No bio available"
          />
        </div>
      </div>
    </div>
  );
}