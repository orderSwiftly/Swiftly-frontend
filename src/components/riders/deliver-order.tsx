// src/components/riders/deliver-order.tsx

"use client";

import { deliverOrder } from "@/lib/rider-order";
import { useState } from "react";
import { Loader2, X, Clipboard } from "lucide-react";
import PulseLoader from "../pulse-loader";
import toast from "react-hot-toast";

export default function DeliverOrderButton({
    orderId,
    onSuccess,
    onError,
}: {
    orderId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [enteredCode, setEnteredCode] = useState("");
    const [codeError, setCodeError] = useState("");

    const handleDeliverClick = () => {
        setShowModal(true);
        setEnteredCode("");
        setCodeError("");
    };

// In deliver-order.tsx, the handleSubmit function is fine, but ensure:
const handleSubmit = async () => {
    if (!enteredCode || enteredCode.length !== 6) {
        setCodeError("Please enter a valid 6-digit delivery code");
        toast.error("Please enter a valid 6-digit delivery code")
        return;
    }

    setLoading(true);
    setCodeError("");
    
    try {
        // The enteredCode is a string like "314773"
        // It will be converted to number 314773 in the deliverOrder function
        await deliverOrder(orderId, enteredCode);
        setShowModal(false);
        onSuccess();
        toast.success("Order marked as delivered successfully!");
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Failed to deliver order";
        setCodeError(errorMessage);
        onError(errorMessage);
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};

    return (
        <>
            <button
                onClick={handleDeliverClick}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--bg-clr)] hover:bg-[#8acc2a] disabled:opacity-60 text-[var(--txt-clr)] text-sm font-semibold transition-colors cursor-pointer"
            >
                {loading ? <PulseLoader /> : "Enter Delivery Code"}
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Confirm Delivery
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-4">
                                <label htmlFor="delivery-code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Code
                                </label>
                                <input
                                    id="delivery-code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={enteredCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length <= 6) {
                                            setEnteredCode(value);
                                            setCodeError("");
                                        }
                                    }}
                                    placeholder="Enter 6-digit code from customer"
                                    className="w-full px-4 py-3 text-lg text-center tracking-wider border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8acc2a] focus:border-transparent"
                                    autoFocus
                                />
                                {codeError && (
                                    <p className="mt-2 text-sm text-red-600">{codeError}</p>
                                )}
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
                                <Clipboard size={20} className="text-blue-500 mx-auto mb-2" />
                                <p className="text-sm text-blue-800">
                                    Ask the customer for their 6-digit delivery code to complete this order.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 pt-0">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !enteredCode || enteredCode.length !== 6}
                                className="flex-1 px-4 py-2 bg-(--prof-clr) hover:bg-[#7ab825] disabled:opacity-50 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <span>Confirm Delivery</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}