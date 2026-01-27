"use client";

import { AlertCircle } from "lucide-react";

interface DeleteAddressModalProps {
  address: {
    hallType: string;
    hallName: string;
    roomFloor: string;
    roomNumber: string;
  } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAddressModal({
  address,
  onClose,
  onConfirm,
}: DeleteAddressModalProps) {
  if (!address) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-[#D92D20]" />
          </div>
        </div>

        <h3 className="font-medium text-[#101828] text-center mb-2">
          Delete {address.hallType}, {address.hallName}, {address.roomFloor},{" "}
          {address.roomNumber}
        </h3>

        <p className="text-xs text-[#667085] text-center mb-6">
          Are you sure you want to delete this? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#D92D20] text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
