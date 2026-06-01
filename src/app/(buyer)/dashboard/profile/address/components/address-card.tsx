// src/app/(buyer)/dashboard/profile/address/components/address-card.tsx

"use client";

export interface Address {
  _id: string;
  room: string;
  building: string;
  isSelected: boolean;
}

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

export default function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
      <div className="grid grid-cols-2 gap-y-2 mb-4">
        <div>
          <span className="text-xs text-gray-500">Building</span>
          <p className="text-[#090A0A] font-medium">{address.building}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Room</span>
          <p className="text-[#090A0A] font-medium">{address.room}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onDelete(address._id)}
          className="flex-1 py-2.5 bg-[#D92D20] text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}