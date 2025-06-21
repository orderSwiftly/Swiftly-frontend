'use client';

import { motion } from 'framer-motion';
import FooterColumn from "./footer-column";
import FooterSocials from "./footer-socials";
import FooterBottom from "./footer-bottom";
import { Shield, UserCheck, Trophy } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-clr)] text-[var(--txt-clr)] py-12 px-6 sm:px-12 mt-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Left section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="col-span-1 sm:col-span-2"
        >
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
        </motion.div>

        {/* Footer Columns with animation */}
        {[ 
          { title: "Marketplace", items: ["Browse Products", "Verified Sellers", "Weekly Winners", "Review System"] },
          { title: "Safety", items: ["Escrow Protection", "Seller Verification", "Trust System", "Dispute Resolution"] },
          { title: "Support", items: ["Help Center", "Seller Guide", "Buyer Protection", "Contact Us"] },
        ].map((col, idx) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * idx }}
            viewport={{ once: true }}
          >
            <FooterColumn title={col.title} items={col.items} />
          </motion.div>
        ))}
      </div>

      {/* Footer bottom with scroll animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <FooterBottom />
      </motion.div>
    </footer>
  );
}