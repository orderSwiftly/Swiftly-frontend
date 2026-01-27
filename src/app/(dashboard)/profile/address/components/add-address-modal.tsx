"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AddAddressModalProps {
  onClose: () => void;
  onAdd: (address: {
    hallType: string;
    hallName: string;
    roomFloor: string;
    roomNumber: string;
  }) => void;
}

export default function AddAddressModal({
  onClose,
  onAdd,
}: AddAddressModalProps) {
  const [hallType, setHallType] = useState("Male");
  const [hallName, setHallName] = useState("Winslow");
  const [roomFloor, setRoomFloor] = useState("A");
  const [roomNumber, setRoomNumber] = useState("28");

  const hallTypes = ["Male", "Female"];
  const hallNames = ["Winslow", "Makama", "Daleko", "Jasdniel", "Moremi"];
  const roomFloors = ["A", "B", "C", "D", "E", "Ground"];
  const roomNumbers = Array.from({ length: 50 }, (_, i) => (i + 1).toString());

  const handleProceed = () => {
    onAdd({
      hallType,
      hallName,
      roomFloor,
      roomNumber,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-[#101828] text-center mb-6">
          Add Address
        </h3>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#344054] font-medium mb-2">
                Hall Type
              </label>
              <div className="relative">
                <select
                  value={hallType}
                  onChange={(e) => setHallType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {hallTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#344054] font-medium mb-2">
                Hall Name
              </label>
              <div className="relative">
                <select
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {hallNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#344054] font-medium mb-2">
                Room Floor
              </label>
              <div className="relative">
                <select
                  value={roomFloor}
                  onChange={(e) => setRoomFloor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {roomFloors.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#344054] font-medium mb-2">
                Room Number
              </label>
              <div className="relative">
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {roomNumbers.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#D0D5DD] text-[#344054] text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="flex-1 py-2.5 bg-[#669917] text-white text-sm font-medium rounded-lg hover:bg-[#4a6d0d] transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
