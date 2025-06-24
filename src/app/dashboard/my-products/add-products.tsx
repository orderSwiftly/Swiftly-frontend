'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  closeModal: () => void;
}

export default function AddProducts({ closeModal }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    location: '',
    biddingEnabled: false,
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      if (images) {
        Array.from(images).forEach(file => {
          payload.append('productImg', file); // or whatever your backend field expects
        });
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/new-product`, {
        method: 'POST',
        credentials: 'include',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? 'Failed to add product');
      }

      toast.success('Product added successfully');
      closeModal();
    } catch (err) {
      console.error('Something went wrong', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[var(--bg-clr)]">Add a new product</h1>
          <button onClick={closeModal} className="text-red-500 font-semibold text-sm">
            Close
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Product Title" className="p-3 border rounded-md" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-3 border rounded-md resize-none" required />
          <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Price" className="p-3 border rounded-md" required />
          <input name="stock" value={formData.stock} onChange={handleChange} type="number" placeholder="Stock Quantity" className="p-3 border rounded-md" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="p-3 border rounded-md" required />

          <label className="flex gap-2 items-center text-sm">
            <input
              type="checkbox"
              name="biddingEnabled"
              checked={formData.biddingEnabled}
              onChange={handleChange}
            />
            Enable Bidding
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--acc-clr)] text-white px-4 py-3 rounded-md font-semibold"
          >
            {loading ? 'Uploading...' : 'Submit Product'}
          </button>
        </form>
      </div>
    </div>
  );
}