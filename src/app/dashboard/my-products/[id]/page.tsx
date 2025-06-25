'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: string;
};

export default function ProductDetails() {
  const { id } = useParams(); // gets the dynamic route param
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (!res.ok || data.status !== 'success') {
          toast.error(data.message ?? 'Failed to fetch product');
          return;
        }

        setProduct(data.data.product);
      } catch (error) {
        toast.error('Error fetching product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10 text-red-500">Product not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>

      <div className="relative w-full h-64 mb-6">
        <Image
          src={product.productImg?.[0] || '/fallback.jpg'}
          alt={product.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <p className="mb-4 text-gray-700">{product.description}</p>
      <p className="font-semibold mb-2">₦{product.price.toLocaleString()}</p>
      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
      <p className="text-sm text-gray-600">Location: {product.location}</p>
      <p className="text-sm capitalize text-gray-600">Status: {product.productStatus}</p>
    </div>
  );
}