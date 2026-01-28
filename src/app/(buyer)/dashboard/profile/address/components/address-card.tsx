"use client";

export interface Address {
  _id: string;
  hallType: string;
  hallName: string;
  roomFloor: string;
  roomNumber: string;
  isSelected: boolean;
}

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

export default function AddressCard({
  address,
  onDelete,
  onToggleSelect,
}: AddressCardProps) {
  return (
    <div className={"bg-white rounded-xl border border-gray-200 p-4 mb-3"}>
      <div className="grid grid-cols-2 gap-y-2 mb-4">
        <div>
          <span className="text-[#090A0A]">Hall Type</span>
        </div>
        <div className="text-right">
          <span className="text-[#090A0A]">{address.hallType}</span>
        </div>

        <div>
          <span className="text-[#090A0A]">Hall Name</span>
        </div>
        <div className="text-right">
          <span className="text-[#090A0A]">{address.hallName}</span>
        </div>

        <div>
          <span className="text-[#090A0A]">Room Floor</span>
        </div>
        <div className="text-right">
          <span className="text-[#090A0A]">{address.roomFloor}</span>
        </div>

        <div>
          <span className="text-[#090A0A]">Room Number</span>
        </div>
        <div className="text-right">
          <span className="text-[#090A0A]">{address.roomNumber}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onDelete(address._id)}
          className="flex-1 py-2.5 bg-[#D92D20] text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
        <button
          onClick={() => onToggleSelect(address._id)}
          className={`flex-1 py-2.5 font-medium rounded-lg transition ${
            address.isSelected
              ? "bg-[#669917] text-white hover:bg-[#4a6d0d]"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {address.isSelected ? "Unselect" : "Select"}
        </button>
      </div>
    </div>
  );
}
