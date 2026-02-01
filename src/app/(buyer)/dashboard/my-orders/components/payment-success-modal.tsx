"use client";

import successImage from "../../../../../../public/payment_success.png";

interface PaymentSuccessModalProps {
  onClose: () => void;
}

export default function PaymentSuccessModal({
  onClose,
}: PaymentSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-lg font-medium text-[#101828] mb-6">
            Payment Successful
          </h2>

          <div className="relative w-48 h-48 mb-4">
            <img
              src={successImage.src}
              alt="Payment Successful"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg bg-[#669917] text-white font-medium hover:bg-green-700 transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
