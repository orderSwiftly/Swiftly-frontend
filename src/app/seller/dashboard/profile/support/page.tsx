"use client";

import { Headphones, MessageSquareWarning, Clock, CheckCircle } from "lucide-react";
import ComplaintForm from "@/components/complaint-modal";

const stats = [
    { label: "Avg. Response", value: "< 2hrs", icon: Clock },
    { label: "Resolved Today", value: "98%", icon: CheckCircle },
];

export default function SupportPage() {
    const scrollToForm = () => {
        document.getElementById("complaint-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-[var(--txt-clr)] px-4 py-10 shadow-md rounded-2xl w-full">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--acc-clr)]/15 flex items-center justify-center">
                            <Headphones size={20} className="text-[var(--acc-clr)]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--acc-clr)] pry-ff tracking-tight">
                            Support
                        </h1>
                    </div>
                    <p className="text-[var(--dark-bg)]/60 sec-ff">
                        Having trouble? We're here to help. File a complaint and we'll get back to you fast.
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-4 mt-5">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--pry-clr)]/40 border border-[var(--txt-clr)]/10"
                            >
                                <Icon size={15} className="text-[var(--acc-clr)]" />
                                <div>
                                    <p className="text-xs text-[var(--txt-clr)]/40 sec-ff">{label}</p>
                                    <p className="text-sm font-semibold text-[var(--acc-clr)] pry-ff">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider with label */}
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquareWarning size={16} className="text-[var(--acc-clr)] shrink-0" />
                    <h2 className="text-base font-semibold text-[var(--dark-bg)] pry-ff">File a Complaint</h2>
                    <div className="flex-1 h-px bg-[var(--txt-clr)]/10" />
                </div>

                {/* Form */}
                <div id="complaint-form">
                    <ComplaintForm />
                </div>
            </div>
        </main>
    );
}