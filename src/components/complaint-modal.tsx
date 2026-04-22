"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CreateComplaint } from "@/lib/create-complaint";
import PulseLoader from "./pulse-loader";
import toast from "react-hot-toast";

export default function ComplaintForm() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await CreateComplaint({ subject, content, attachments: [] });
      toast.success("Complaint submitted successfully");
      setSubject("");
      setContent("");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--txt-clr)] rounded-2xl border border-[var(--pry-clr)]/10 shadow-sm p-6 w-full">
      <p className="text-sm text-[var(--pry-clr)]/60 sec-ff mb-6">
        Describe your issue and our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-[var(--pry-clr)]/50 sec-ff mb-1 uppercase tracking-wider">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border border-[var(--pry-clr)]/15 bg-[var(--pry-clr)]/5 text-[var(--pry-clr)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]/50 focus:border-[var(--acc-clr)] transition sec-ff placeholder:text-[var(--pry-clr)]/30"
            placeholder="e.g. Order not delivered"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-[var(--pry-clr)]/50 sec-ff mb-1 uppercase tracking-wider">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            className="w-full border border-[var(--pry-clr)]/15 bg-[var(--pry-clr)]/5 text-[var(--pry-clr)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]/50 focus:border-[var(--acc-clr)] transition sec-ff placeholder:text-[var(--pry-clr)]/30 resize-none"
            placeholder="Describe your issue in detail..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--acc-clr)] text-[var(--pry-clr)] sec-ff font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <PulseLoader />
            ) : (
              <>
                <Send size={15} />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}