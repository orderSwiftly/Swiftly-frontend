'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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

  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
    const imagePreviews = selectedArray.map(file => URL.createObjectURL(file));
    setPreviewURLs(imagePreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      if (images.length === 0) {
        toast.error('At least one image is required.');
        setLoading(false);
        return;
      }

      images.forEach(file => {
        payload.append('productImg', file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/new-product`, {
        method: 'POST',
        credentials: 'include',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? 'Failed to add product');

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
      <div className="bg-[var(--bg-clr)] text-[var(--txt-clr)] rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[var(--txt-clr)] cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl md:text-3xl font-bold pry-ff mb-2">Add New Product</h2>
        <p className="text-sm md:text-base sec-ff text-[var(--txt-clr)] mb-6">
          Fill in the details of your product below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sec-ff">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)] resize-none"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="Price"
              className="p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
              required
            />
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              type="number"
              placeholder="Stock Quantity"
              className="p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
              required
            />
          </div>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
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

          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-white file:bg-[var(--acc-clr)] hover:file:bg-opacity-80 cursor-pointer"
              required
            />

            {/* Image Preview */}
            {previewURLs.length > 0 && (
              <div className="flex gap-2 mt-3">
                {previewURLs.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`preview-${index}`}
                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg font-semibold hover:shadow-[0_0_15px_#2DCAD7] hover:brightness-110 transition cursor-pointer"
          >
            {loading ? 'Uploading...' : 'Submit Product'}
          </button>
        </form>
      </div>
    </div>
  );
}