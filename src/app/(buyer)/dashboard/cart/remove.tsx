// src/app/(buyer)/dashboard/cart/remove.tsx
import { Trash2 } from "lucide-react";

type Props = {
  onRemove: () => void;
};

export default function AddToCart({ onRemove }: Props) {
  return (
    <div className="flex items-center gap-2 mt-4">
        <button
            className="p-3 rounded-lg cursor-pointer bg-red-500 hover:bg-red-600 text-[var(--txt-clr)]"
            onClick={onRemove}>
            <Trash2 size={16} />
        </button>
    </div>
  );
}