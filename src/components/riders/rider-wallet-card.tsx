"use client";

import { useEffect, useState } from "react";
import { fetchRiderBankDetails } from "@/lib/rider";
import { Banknote, Plus } from "lucide-react";
import Spinner from "../pulse-loader";
import GetBankDetails from "@/components/riders/rider-bank-details";
import AddBankDetails from "@/components/riders/add-bank-details";

export default function RiderBankDetails() {
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const checkBankDetails = async () => {
    try {
      const data = await fetchRiderBankDetails();
      setHasBankDetails(!!data);
    } catch {
      setHasBankDetails(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBankDetails();
  }, [refreshKey]);

  const handleSuccess = () => {
    setShowModal(false);
    setRefreshKey((k) => k + 1);
  };

  if (loading)
    return (
      <div className="flex items-center w-full justify-center py-10">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between p-6">
        <p className="text-sm sec-ff text-(--sec-clr)">Payout account</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm sec-ff px-3 py-1.5 rounded-md bg-(--bg-clr) text-(--acc-clr) cursor-pointer"
        >
          <Plus size={14} />
          {hasBankDetails ? "Update bank" : "Add bank"}
        </button>
      </div>

      {/* Empty state */}
      {!hasBankDetails && (
        <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-(--txt-clr) text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-(--bg-clr)">
            <Banknote size={22} color="#9BDD37" />
          </div>
          <p className="text-base font-medium sec-ff text-(--pry-clr)">No payout account yet</p>
          <p className="text-sm sec-ff text-(--sec-clr) max-w-xs">
            Add your bank details so you can receive payouts directly to your account.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-1 flex items-center gap-2 px-4 py-2 rounded-full text-sm sec-ff bg-(--bg-clr) text-(--acc-clr)"
          >
            <Plus size={14} />
            Add bank
          </button>
        </div>
      )}

      {/* Bank details */}
      {hasBankDetails && <GetBankDetails key={refreshKey} />}

      {/* Modal */}
      {showModal && (
        <AddBankDetails onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}