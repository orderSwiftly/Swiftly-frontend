"use client";

import { AlertCircle } from "lucide-react";

interface PaymentErrorModalProps {
  onClose: () => void;
}

export default function PaymentErrorModal({ onClose }: PaymentErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full border-4 border-red-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-[16px] font-semibold text-gray-900 mb-2">
            An error occurred
          </h2>

          <p className="text-xs text-[#667085] mb-6">Please try again later</p>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-xs text-[#344054] font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
