"use client";

import { CreditCard, Repeat, Banknote } from "lucide-react";
import { useState } from "react";

interface PaymentMethodModalProps {
  onClose: () => void;
  onConfirm: (method: "card" | "transfer" | "cash") => void;
}

export default function PaymentMethodModal({
  onClose,
  onConfirm,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "card" | "transfer" | "cash"
  >("card");

  const handleProceed = () => {
    onConfirm(selectedMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#C8FF73] flex items-center justify-center mb-4">
          <CreditCard className="w-6 h-6 text-[#355505]" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Choose payment method
        </h2>

        <p className="text-xs text-[#667085] mb-6">
          Please Select a method below
        </p>

        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={selectedMethod === "card"}
              onChange={() => setSelectedMethod("card")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Pay by Card
            </span>
            <span className="ml-auto">💳</span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="payment"
              value="transfer"
              checked={selectedMethod === "transfer"}
              onChange={() => setSelectedMethod("transfer")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <Repeat className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Pay by Transfer
            </span>
            <span className="ml-auto">🏦</span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={selectedMethod === "cash"}
              onChange={() => setSelectedMethod("cash")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <Banknote className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Pay by Cash
            </span>
            <span className="ml-auto">💵</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#669917] text-white font-medium hover:bg-[#4a6d0d] transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
