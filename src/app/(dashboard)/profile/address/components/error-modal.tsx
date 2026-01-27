"use client";

import { AlertCircle } from "lucide-react";

interface ErrorModalProps {
  onClose: () => void;
}

export default function ErrorModal({ onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-[#D92D20]" />
          </div>
        </div>

        <h3 className="font-medium text-[#101828] text-center mb-2">
          An error occurred
        </h3>

        <p className="text-xs text-[#667085] text-center mb-6">
          Please try again later
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
