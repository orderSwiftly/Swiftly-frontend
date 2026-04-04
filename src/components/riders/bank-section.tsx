"use client";

import { useEffect, useState } from "react";
import {
  getBanksList,
  resolveAccount,
  addBankDetails,
  Bank,
} from "@/lib/rider";
import {
  Banknote,
  Building2,
  CircleCheck,
  Eye,
  EyeOff,
  Hash,
  User,
  Plus,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import Spinner from "../pulse-loader";
import { fetchRiderBankDetails } from "@/lib/rider";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export default function BankSection() {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    load();
  }, []);

  const handleAdded = async () => {
    setShowModal(false);
    setLoading(true);
    await load();
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
      <div className="flex items-center justify-between">
        <p className="text-sm sec-ff text-(--sec-clr)">Payout account</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm sec-ff px-3 py-1.5 rounded-full bg-(--bg-clr) text-(--acc-clr)"
        >
          <Plus size={14} />
          {bankDetails ? "Update bank" : "Add bank"}
        </button>
      </div>

      {/* Content */}
      {error && !bankDetails && (
        <div className="flex items-center w-full justify-center text-base text-red-400 sec-ff">
          {error}
        </div>
      )}

      {!bankDetails && !error && (
        <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-(--txt-clr) text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-(--bg-clr)">
            <Banknote size={22} color="#9BDD37" />
          </div>
          <p className="text-base font-medium sec-ff text-(--pry-clr)">
            No payout account yet
          </p>
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

      {bankDetails && <RiderBankDetails bankDetails={bankDetails} />}

      {/* Modal */}
      {showModal && (
        <AddBankModal onClose={() => setShowModal(false)} onSuccess={handleAdded} />
      )}
    </div>
  );
}

function RiderBankDetails({ bankDetails }: { bankDetails: BankDetails }) {
  const [masked, setMasked] = useState(true);

  const maskAccount = (num: string) =>
    `${"•".repeat(num.length - 4)}${num.slice(-4)}`;

  return (
    <div className="rounded-2xl p-6 space-y-5 bg-(--txt-clr)">
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

      <div className="rounded-xl p-5 space-y-4 bg-(--bg-clr)">
        <div className="flex items-center gap-2">
          <Building2 size={14} color="#9BDD37" />
          <p className="text-sm sec-ff text-(--acc-clr)">{bankDetails.bankName}</p>
        </div>
        <p className="text-2xl font-semibold tracking-widest sec-ff text-(--txt-clr)">
          {masked ? maskAccount(bankDetails.accountNumber) : bankDetails.accountNumber}
        </p>
        <div className="flex items-center gap-2">
          <User size={14} color="#c0c0c0" />
          <p className="text-base sec-ff text-(--sec-clr)">{bankDetails.accountName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash size={16} color="#669917" />
            <span className="text-sm sec-ff text-(--sec-clr)">Account Number</span>
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
          <span className="text-sm sec-ff text-(--pry-clr)">{bankDetails.bankName}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={16} color="#669917" />
            <span className="text-sm sec-ff text-(--sec-clr)">Account Name</span>
          </div>
          <span className="text-sm sec-ff text-(--pry-clr)">{bankDetails.accountName}</span>
        </div>
      </div>
    </div>
  );
}

function AddBankModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getBanksList()
      .then(setBanks)
      .catch(() => {})
      .finally(() => setBanksLoading(false));
  }, []);

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-resolve when account number is 10 digits and bank is selected
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      setAccountName("");
      setResolveError(null);
      setResolving(true);
      resolveAccount(accountNumber, selectedBank.code)
        .then((res) => setAccountName(res.account_name))
        .catch((err) => setResolveError(err.message))
        .finally(() => setResolving(false));
    } else {
      setAccountName("");
      setResolveError(null);
    }
  }, [accountNumber, selectedBank]);

  const handleSubmit = async () => {
    if (!selectedBank || !accountNumber || !accountName) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addBankDetails({
        account_number: accountNumber,
        bank_code: selectedBank.code,
        bank_name: selectedBank.name,
      });
      onSuccess();
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !!selectedBank && accountNumber.length === 10 && !!accountName && !resolving;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-3xl bg-(--bg-clr) p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-base font-medium sec-ff text-(--pry-clr)">Add bank account</p>
          <button onClick={onClose} className="text-(--sec-clr)">
            <X size={20} />
          </button>
        </div>

        {/* Bank selector */}
        <div className="space-y-1.5">
          <label className="text-xs sec-ff text-(--sec-clr)">Select bank</label>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-(--txt-clr) text-sm sec-ff text-(--pry-clr)"
          >
            <span>{selectedBank ? selectedBank.name : "Choose a bank"}</span>
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="rounded-xl bg-(--txt-clr) overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-(--sec-clr)/20">
                <Search size={14} className="text-(--sec-clr)" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bank..."
                  className="flex-1 bg-transparent text-sm sec-ff text-(--pry-clr) outline-none placeholder:text-(--sec-clr)"
                />
              </div>
              {/* List */}
              <div className="max-h-48 overflow-y-auto">
                {banksLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : filteredBanks.length === 0 ? (
                  <p className="text-sm text-center sec-ff text-(--sec-clr) py-4">No banks found</p>
                ) : (
                  filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => {
                        setSelectedBank(bank);
                        setDropdownOpen(false);
                        setSearch("");
                      }}
                      className={`w-full text-left px-4 py-3 text-sm sec-ff text-(--pry-clr) hover:bg-(--bg-clr) transition-colors ${
                        selectedBank?.code === bank.code ? "text-(--acc-clr)" : ""
                      }`}
                    >
                      {bank.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Account number */}
        <div className="space-y-1.5">
          <label className="text-xs sec-ff text-(--sec-clr)">Account number</label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="0000000000"
            inputMode="numeric"
            className="w-full px-4 py-3 rounded-xl bg-(--txt-clr) text-sm sec-ff text-(--pry-clr) outline-none placeholder:text-(--sec-clr)"
          />
        </div>

        {/* Resolved account name */}
        <div className="min-h-[40px] flex items-center gap-2 px-4 py-3 rounded-xl bg-(--txt-clr)">
          {resolving ? (
            <Spinner />
          ) : resolveError ? (
            <p className="text-sm text-red-400 sec-ff">{resolveError}</p>
          ) : accountName ? (
            <>
              <CircleCheck size={16} color="#9BDD37" />
              <p className="text-sm sec-ff text-(--acc-clr)">{accountName}</p>
            </>
          ) : (
            <p className="text-sm sec-ff text-(--sec-clr)">Account name will appear here</p>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-400 sec-ff">{submitError}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full py-3 rounded-xl text-sm font-medium sec-ff bg-(--acc-clr) text-(--bg-clr) disabled:opacity-40 transition-opacity"
        >
          {submitting ? "Saving..." : "Save account"}
        </button>
      </div>
    </div>
  );
}