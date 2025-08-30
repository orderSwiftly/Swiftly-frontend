"use client";

import { useState, useRef } from "react";
import { X, Paperclip } from "lucide-react";
import { CreateComplaint } from "@/lib/create-complaint";
import PulseLoader from "./pulse-loader";
import toast from "react-hot-toast";

interface ComplaintModalProps {
  readonly onClose: () => void;
}

export default function ComplaintModal({ onClose }: ComplaintModalProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + attachments.length > 4) {
        toast.error("You can only upload up to 4 attachments");
        return;
      }
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await CreateComplaint({ subject, content, attachments });
      toast.success("Complaint submitted successfully");
      setSubject("");
      setContent("");
      setAttachments([]);
      onClose();
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end mr-2 z-50">
      <div className="bg-[var(--light-bg)] rounded-2xl shadow-lg p-6 w-full max-w-md h-fit overflow-y-auto flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--acc-clr)] hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        <h1 className="text-xl font-semibold mb-4 text-[var(--acc-clr)] pry-ff text-center">
          File a Complaint
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Subject */}
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border border-[var(--acc-clr)] text-[var(--txt-clr)] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] sec-ff"
            placeholder="Enter complaint subject"
          />

          {/* Complaint Content */}
          <textarea
            id="complaint"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            className="w-full border border-[var(--acc-clr)] text-[var(--txt-clr)] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] sec-ff"
            placeholder="Describe your issue..."
          />

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-[var(--txt-clr)] sec-ff">
              Attachments (optional, max 4):
            </label>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex items-center gap-2 px-3 py-2 border border-[var(--acc-clr)] cursor-pointer rounded-lg text-sm text-[var(--acc-clr)] hover:bg-[var(--acc-clr)] hover:text-[var(--bg-clr)] transition duration-200 sec-ff"
            >
              <Paperclip size={16} />
              Choose Files
            </button>

            {/* File preview grid */}
            <div className="flex flex-wrap gap-3 mt-3">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-black/50 text-[var(--acc-clr)] cursor-pointer rounded-full p-1 text-xs hover:bg-black"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm sec-ff"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[var(--acc-clr)] text-[var(--bg-clr)] sec-ff hover:bg-opacity-90 text-sm disabled:opacity-50"
            >
              {loading ? <PulseLoader /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}