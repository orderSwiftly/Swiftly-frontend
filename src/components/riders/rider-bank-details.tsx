"use client";
import { fetchRiderBankDetails } from "@/lib/rider";
import { useEffect, useState } from "react";
import { Banknote, Building2, CircleCheck, Eye, EyeOff, Hash, User } from "lucide-react";
import Spinner from "../pulse-loader";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export default function RiderBankDetails() {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [masked, setMasked] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRiderBankDetails();
        setBankDetails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maskAccount = (num: string) =>
    `${"•".repeat(num.length - 4)}${num.slice(-4)}`;

  if (loading)
    return <div className="flex items-center sec-ff w-full justify-center py-10">
      <Spinner />
    </div>;
  if (error)
    return <div className="flex items-center sec-ff w-full justify-center text-base text-red-400 sec-ff">{error}</div>;
  if (!bankDetails)
    return <div className="flex items-center sec-ff w-full justify-center text-base text-(--sec-clr) sec-ff">No bank details found.</div>;

  return (
    <div className="rounded-2xl p-6 space-y-5 bg-(--txt-clr)">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-(--bg-clr)">
            <Banknote size={20} color="#9BDD37" />
          </div>
          <span className="text-base font-medium sec-ff text-(--pry-clr)">
            Payout Account
          </span>
        </div>
        <span className="text-sm px-3 py-1 rounded-full sec-ff flex items-center gap-1 bg-(--bg-clr) text-(--acc-clr)">
          <CircleCheck size={13} />
          Active
        </span>
      </div>

      {/* Bank card */}
      <div className="rounded-xl p-5 space-y-4 bg-(--bg-clr)">
        <div className="flex items-center gap-2">
          <Building2 size={14} color="#9BDD37" />
          <p className="text-sm sec-ff text-(--acc-clr)">
            {bankDetails.bankName}
          </p>
        </div>
        <p className="text-2xl font-semibold tracking-widest sec-ff text-(--txt-clr)">
          {masked ? maskAccount(bankDetails.accountNumber) : bankDetails.accountNumber}
        </p>
        <div className="flex items-center gap-2">
          <User size={14} color="#c0c0c0" />
          <p className="text-base sec-ff text-(--sec-clr)">
            {bankDetails.accountName}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash size={16} color="#669917" />
            <span className="text-sm sec-ff text-(--sec-clr)">
              Account Number
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sec-ff text-(--pry-clr)">
              {masked ? maskAccount(bankDetails.accountNumber) : bankDetails.accountNumber}
            </span>
            <button onClick={() => setMasked(!masked)} className="text-(--prof-clr)">
              {masked ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} color="#669917" />
            <span className="text-sm sec-ff text-(--sec-clr)">Bank</span>
          </div>
          <span className="text-sm sec-ff text-(--pry-clr)">
            {bankDetails.bankName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={16} color="#669917" />
            <span className="text-sm sec-ff text-(--sec-clr)">Account Name</span>
          </div>
          <span className="text-sm sec-ff text-(--pry-clr)">
            {bankDetails.accountName}
          </span>
        </div>
      </div>
    </div>
  );
}