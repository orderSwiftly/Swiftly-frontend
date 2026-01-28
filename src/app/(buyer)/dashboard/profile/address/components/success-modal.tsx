"use client";

import Image from "next/image";

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-[#101828] text-center mb-6">
          Address added Successful
        </h3>

        <div className="flex justify-center mb-4">
          <div className="relative w-52 h-36">
            <Image
              src="/payment_success.png"
              alt="Success"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#669917] text-white font-medium rounded-lg hover:bg-[#4a6d0d] transition"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
