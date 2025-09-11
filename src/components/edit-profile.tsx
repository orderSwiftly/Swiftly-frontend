"use client";
import { useState } from "react";
import { AdditionalInfo } from "@/lib/additional-info";

export default function EditProfile() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber && !photo) return;

    const result = await AdditionalInfo({ phoneNumber, photo: photo ?? undefined });
    console.log("Update result:", result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}
