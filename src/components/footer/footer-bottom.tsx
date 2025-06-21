export default function FooterBottom() {
    return (
      <div className="mt-8 pt-6 border-t border-white/10 text-sm text-white/60 flex flex-col sm:flex-row justify-between items-center gap-2 sec-ff">
        <span>&copy; 2024 Tredia. All rights reserved. | Secure marketplace with escrow protection.</span>
        <div className="flex gap-4">
          <li className="hover:text-[var(--txt-clr)]">Privacy Policy</li>
          <li className="hover:text-[var(--txt-clr)]">Terms of Service</li>
          <li className="hover:text-[var(--txt-clr)]">Seller Agreement</li>
        </div>
      </div>
    );
}
