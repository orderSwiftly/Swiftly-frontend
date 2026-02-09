'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import { CATEGORIES } from '@/lib/categories';

interface Props {
  closeModal: () => void;
}

export default function AddProducts({ closeModal }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryName: '',
    price: '',
    stock: '',
    location: '',
    biddingEnabled: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const selectedArray = Array.from(selectedFiles);

    if (selectedArray.length > 3) {
      toast.error('You can upload a maximum of 3 images.');
      return;
    }

    setImages(selectedArray);
    setPreviewURLs(selectedArray.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.categoryName) {
        toast.error('Please select a category');
        return;
      }

      if (images.length === 0) {
        toast.error('At least one image is required.');
        return;
      }

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, String(value))
      );

      images.forEach(file => payload.append('productImg', file));

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/new-product`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Product added successfully');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-clr)] text-[var(--txt-clr)] rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto scroll-smooth scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[var(--txt-clr)] cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold pry-ff mb-2">
          Add New Product
        </h2>
        <p className="text-sm md:text-base sec-ff mb-6">
          Fill in the details of your product below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sec-ff">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full p-3 rounded-lg bg-white/10 outline-none focus:ring-2 ring-[var(--acc-clr)]"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full p-3 rounded-lg bg-white/10 outline-none focus:ring-2 ring-[var(--acc-clr)] resize-none"
            required
          />

          {/* CATEGORY SELECT (HARDCODED) */}
          <select
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[var(--txt-clr)]/60 outline-none focus:ring-2 ring-[var(--acc-clr)] text-[var(--pry-clr)]"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {CATEGORIES.map((category: string) => (
              <option key={category} value={category}>
              {category}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="Price"
              className="p-3 rounded-lg bg-white/10 outline-none focus:ring-2 ring-[var(--acc-clr)]"
              required
            />
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              type="number"
              placeholder="Stock Quantity"
              className="p-3 rounded-lg bg-white/10 outline-none focus:ring-2 ring-[var(--acc-clr)]"
              required
            />
          </div>

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 rounded-lg bg-white/10 outline-none focus:ring-2 ring-[var(--acc-clr)]"
            required
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="biddingEnabled"
              checked={formData.biddingEnabled}
              onChange={handleChange}
              className="accent-[var(--acc-clr)]"
            />
            Enable Bidding
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-white file:bg-[var(--acc-clr)] cursor-pointer"
            required
          />

          {previewURLs.length > 0 && (
            <div className="flex gap-2 mt-3">
              {previewURLs.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`preview-${i}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[var(--acc-clr)] flex items-center justify-center px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? <PulseLoader /> : 'Submit Product'}
          </button>
        </form>
      </div>
    </div>
  );
}