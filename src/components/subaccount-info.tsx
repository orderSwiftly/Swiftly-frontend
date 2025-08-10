import { useState } from "react";
import { Store, Info, ArrowRight, X } from "lucide-react";
import Link from "next/link";

interface SubaccountBannerInfo {
    isOpen: boolean;
    onDismiss: () => void;
}

export default function SubaccountBannerInfo({
  isOpen,
  onDismiss
}: SubaccountBannerInfo) {
    const [dismissed, setDismissed] = useState(false);

    // Only show for first-time product creators
  if (!isOpen || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
    };
    
    return (
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-6 relative">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
          <Store className="text-green-400" size={24} />
        </div>
        
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-white pry-ff">
            Welcome New Seller! 🎉
          </h3>
          
          <p className="text-gray-300 sec-ff leading-relaxed">
            Great! You`re creating your first product. To start receiving payments from buyers,
            you`ll need to <strong className="text-green-400">create a subaccount</strong> first.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <h4 className="text-white font-semibold sec-ff flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              What happens next?
            </h4>
            <ul className="text-sm text-gray-300 sec-ff space-y-1 ml-6">
              <li>• Create your product (continue with this form)</li>
              <li>• Set up your subaccount for payments</li>
              <li>• Start receiving orders from buyers</li>
              <li>• Get paid directly to your bank account</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard/wallet"
              className="bg-[var(--acc-clr)] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition sec-ff flex items-center gap-2 group"
            >
              <span>Set Up Subaccount</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white sec-ff text-sm underline"
            >
              Remind me later
            </button>
          </div>

          <p className="text-xs text-gray-500 sec-ff">
            💡 <strong>Tip:</strong> You can create products now and set up payments later,
            but buyers won`t be able to purchase until your subaccount is ready.
          </p>
        </div>
      </div>
    </div>
  );
}