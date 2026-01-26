"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export interface CartItem {
  _id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
}

interface CartOrderItemProps {
  item: CartItem;
  onDelete: (itemId: string) => void;
}

export default function CartOrderItem({ item, onDelete }: CartOrderItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border-b border-gray-100">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {item.productImg && item.productImg[0] ? (
          <Image
            src={item.productImg[0]}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 line-clamp-2">{item.title}</h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Qty</span>
          <select
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 bg-white"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <span className="flex flex-col items-center justify-center">
        <p className="text-[#0C0C0C] mt-1">₦{item.price.toLocaleString()}</p>

        <button
          onClick={() => onDelete(item._id)}
          className="p-2 text-gray-400 hover:text-red-600 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </span>
    </div>
  );
}
