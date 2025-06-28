// components/AddToCart.tsx
import { Plus, Minus } from "lucide-react";

type Props = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function AddToCart({ quantity, onIncrement, onDecrement }: Props) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={onDecrement}
        disabled={quantity <= 1}
        className="p-1 bg-white/10 rounded-full text-white hover:bg-white/20 disabled:opacity-50 cursor-pointer"
      >
        <Minus size={16} />
      </button>
      <p className="font-semibold text-[var(--txt-clr)] sec-ff">{quantity}</p>
      <button
        onClick={onIncrement}
        className="p-1 bg-white/10 rounded-full text-white hover:bg-white/20 cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}