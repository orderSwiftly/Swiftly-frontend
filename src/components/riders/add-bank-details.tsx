"use client";

import { useEffect, useState } from "react";
import { getBanksList, resolveAccount, addBankDetails, Bank } from "@/lib/rider";
import { CircleCheck, ChevronDown, Search, X } from "lucide-react";
import Spinner from "../pulse-loader";

interface AddBankDetailsProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBankDetails({ onClose, onSuccess }: Readonly<AddBankDetailsProps>) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl bg-(--bg-clr) p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-base font-medium sec-ff text-(--acc-clr)">Add bank account</p>
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
              <div className="max-h-48 overflow-y-auto">
                {banksLoading ? (
                  <div className="flex justify-center py-4"><Spinner /></div>
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
        <div className="min-h-[48px] flex items-center gap-2 px-4 py-3 rounded-xl bg-(--txt-clr)">
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

        {submitError && <p className="text-sm text-red-400 sec-ff">{submitError}</p>}

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