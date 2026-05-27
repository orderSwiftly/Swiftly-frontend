import Image from "next/image";
import { Plus } from "lucide-react";

interface EmptyAddressStateProps {
  onAdd: () => void;
}

export default function EmptyAddressState({ onAdd }: EmptyAddressStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/no_addresses.png"
          alt="No address"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="text-[#9C9C9C] text-2xl mb-6">No address yet</p>
      <button
        onClick={onAdd}
        className="py-3 px-6 bg-[#669917] text-white font-medium rounded-lg hover:bg-[#4a6d0d] transition flex items-center justify-center gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Add Address
      </button>
    </div>
  );
}