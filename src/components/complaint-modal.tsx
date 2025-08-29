"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CreateComplaint } from "@/lib/create-complaint";
import PulseLoader from "./pulse-loader";
import toast from "react-hot-toast";

interface ComplaintModalProps {
  readonly onClose: () => void;
}

export default function ComplaintModal({ onClose }: ComplaintModalProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await CreateComplaint({ subject, content });
      setSuccess("Complaint submitted successfully");
      toast.success("Complaint submitted successfully");
      setSubject("");
      setContent("");
      // optionally: onClose();
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError("Failed to submit complaint");
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end mr-2 z-50">
      <div className="bg-[var(--light-bg)] rounded shadow-lg p-6 w-full max-w-md h-fit overflow-y-auto flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--acc-clr)] cursor-pointer"
        >
          <X size={20} />
        </button>

        <h1 className="text-xl font-semibold mb-4 text-[var(--acc-clr)] pry-ff text-center">
          File a Complaint
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="text-sm font-medium text-[var(--txt-clr)] sec-ff"
            >
              Subject:
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full border border-[var(--acc-clr)] text-[var(--txt-clr)] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] sec-ff"
              placeholder="Enter complaint subject"
            />
          </div>

          {/* Complaint Content */}
          <div>
            <label
              htmlFor="complaint"
              className="text-sm font-medium text-[var(--txt-clr)] sec-ff"
            >
              Your Complaint:
            </label>
            <textarea
              id="complaint"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              className="w-full border border-[var(--acc-clr)] text-[var(--txt-clr)] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] sec-ff"
              placeholder="Describe your issue..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm sec-ff cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[var(--acc-clr)] text-[bg-clr] sec-ff hover:bg-opacity-90 text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? <PulseLoader /> : "Submit"}
            </button>
          </div>
        </form>

        {/* Feedback */}
        {error && <p className="mt-3 text-sm text-red-500 sec-ff">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600 sec-ff">{success}</p>}
      </div>
    </div>
  );
}