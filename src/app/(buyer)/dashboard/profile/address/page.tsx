"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import EmptyAddressState from "./components/empty-address-state";
import AddressCard, { Address } from "./components/address-card";
import DeleteAddressModal from "./components/delete-address-modal";
import AddAddressModal from "./components/add-address-modal";
import toast from "react-hot-toast";
import PulseLoader from "@/components/pulse-loader";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddressToDelete, setSelectedAddressToDelete] = useState<Address | null>(null);

  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${api_url}/api/v1/user/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.status === "success") {
          setAddresses(data.data.address ?? []);
        } else {
          toast.error(data?.message ?? "Failed to load addresses");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = (newAddress: { building: string; room: string }) => {
    const address: Address = {
      _id: Date.now().toString(),
      ...newAddress,
      isSelected: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, address]);
    setShowAddModal(false);
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
        prev.filter((addr) => addr._id !== selectedAddressToDelete._id)
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
      }))
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
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <PulseLoader />
          </div>
        ) : addresses.length === 0 ? (
          <EmptyAddressState />
        ) : (
          <div className="max-w-4xl">
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
    </div>
  );
}