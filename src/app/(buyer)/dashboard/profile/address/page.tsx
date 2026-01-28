"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import EmptyAddressState from "./components/empty-address-state";
import AddressCard, { Address } from "./components/address-card";
import DeleteAddressModal from "./components/delete-address-modal";
import AddAddressModal from "./components/add-address-modal";
import ErrorModal from "./components/error-modal";
import SuccessModal from "./components/success-modal";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAddressToDelete, setSelectedAddressToDelete] =
    useState<Address | null>(null);

  const handleAddAddress = (newAddress: {
    hallType: string;
    hallName: string;
    roomFloor: string;
    roomNumber: string;
  }) => {
    // Simulate API call - randomly show success or error
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      const address: Address = {
        _id: Date.now().toString(),
        ...newAddress,
        isSelected: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, address]);
      setShowAddModal(false);
      setShowSuccessModal(true);
    } else {
      setShowAddModal(false);
      setShowErrorModal(true);
    }
  };

  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find((addr) => addr._id === id);
    if (addressToDelete) {
      setSelectedAddressToDelete(addressToDelete);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    if (selectedAddressToDelete) {
      setAddresses((prev) =>
        prev.filter((addr) => addr._id !== selectedAddressToDelete._id),
      );
      setShowDeleteModal(false);
      setSelectedAddressToDelete(null);
    }
  };

  const handleToggleSelect = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isSelected: addr._id === id ? !addr.isSelected : false,
      })),
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pry-ff">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-2xl text-center font-bold text-[#0A0A0A]">
          My Addresses
        </h1>
      </header>

      <main className="pb-24 px-4 pt-6">
        {addresses.length === 0 ? (
          <EmptyAddressState />
        ) : (
          <div className="max-w-2xl mx-auto">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onDelete={handleDeleteAddress}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        )}
      </main>

      <div className="fixed md:bottom-8 right-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="py-3 px-6 bg-[#669917] text-white font-medium rounded-lg hover:bg-[#4a6d0d] transition flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </button>
      </div>

      {showAddModal && (
        <AddAddressModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAddress}
        />
      )}

      {showDeleteModal && (
        <DeleteAddressModal
          address={selectedAddressToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAddressToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}

      {showErrorModal && (
        <ErrorModal onClose={() => setShowErrorModal(false)} />
      )}

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
}
