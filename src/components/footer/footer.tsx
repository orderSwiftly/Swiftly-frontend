import FooterColumn from "./footer-column";
import FooterSocials from "./footer-socials";
import FooterBottom from "./footer-bottom";
import { Shield, UserCheck, Trophy } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-clr)] text-[var(--txt-clr)] py-12 px-6 sm:px-12 mt-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Left section */}
        <div className="col-span-1 sm:col-span-2">
          <div className="flex flex-col items-center sm:items-start w-auto h-auto">
            <Image
              src="/tredia-logo.png"
              alt="TrustShop Logo"
              width={150}
              height={50}
              className="h-10 w-auto mb-4"
            />
          </div>
          <p className="text-sm text-white/70 mt-2 max-w-sm sec-ff">
            The world`s first gamified marketplace with verified sellers, escrow protection, and XP rewards for reviews.
          </p>

          {/* Feature List */}
          <ul className="flex flex-col gap-2 mt-4 text-sm text-white/80 sec-ff">
            <li className="flex items-center gap-2">
              <Shield size={16} className="text-green-400" />
              Escrow Protected
            </li>
            <li className="flex items-center gap-2">
              <UserCheck size={16} className="text-green-400" />
              Verified Sellers
            </li>
            <li className="flex items-center gap-2">
              <Trophy size={16} className="text-green-400" />
              Weekly Rewards
            </li>
          </ul>

          <FooterSocials />
        </div>

        {/* Other sections */}
        <FooterColumn
          title="Marketplace"
          items={["Browse Products", "Verified Sellers", "Weekly Winners", "Review System"]}
        />
        <FooterColumn
          title="Safety"
          items={["Escrow Protection", "Seller Verification", "Trust System", "Dispute Resolution"]}
        />
        <FooterColumn
          title="Support"
          items={["Help Center", "Seller Guide", "Buyer Protection", "Contact Us"]}
        />
      </div>

      <FooterBottom />
    </footer>
  );
}