'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import PulseLoader from "@/components/pulse-loader";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await fetch(`${api_url}/api/v1/product/my-products`, {
          method: 'GET',
          credentials: 'include', // ✅ include cookie for protected routes
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setProducts(data.data.products ?? []);
        } else {
          setError(data.message ?? 'Failed to fetch products');
            toast.error(data.message ?? 'Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
        toast.error('An error occurred while fetching products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  let content: React.ReactNode;

  if (loading) {
    content = <div className="flex items-center justify-center h-64"><PulseLoader /></div>;
  } else if (error) {
    content = <p className="text-red-500">{error}</p>;
  } else if (products.length === 0) {
    content = (
      <div className="text-center">
        <Image
          src="/no-product.jpg"
          alt="No products found"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold text-[var(--txt-clr)] sec-ff ">No Products Available</h3>
        <p className="text-gray-500 sec-ff">You haven’t added any products yet.</p>
      </div>
    );
  } else {
    content = (
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product._id} className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold text-lg">{product.title}</h4>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-800 font-bold">₦{product.price}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Products</h2>
      {content}
    </main>
  );
}