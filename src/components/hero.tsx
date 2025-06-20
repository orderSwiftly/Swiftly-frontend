'use client';

import { ShoppingCart, Trophy, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function FirstHero() {
  return (
    <section className="relative w-full max-w-md mx-auto p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-md text-white space-y-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 text-lg font-semibold pry-ff items-center"
      >
        <div className="p-4 rounded-full bg-gradient-to-br from-[#01bbbb] to-[#05e2ff] text-[var(--txt-clr)] flex items-center justify-center">
          <ShoppingCart size={20} />
        </div>
        <span>Secure Cart</span>
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-sm text-white/80 sec-ff"
      >
        Escrow protected • +125 XP
      </motion.p>

      {/* Cart Items */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4"
      >
        {[
          {
            emoji: "🎧",
            title: "Gaming Headset",
            seller: "TechGuru",
            rating: "4.8",
            xp: "+17 XP",
            price: "₦8,999"
          },
          {
            emoji: "⌨️",
            title: "Mechanical Keyboard",
            seller: "KeyMaster",
            rating: "4.9",
            xp: "+29 XP",
            price: "₦11,999"
          },
          {
            emoji: "🖱️",
            title: "RGB Mouse",
            seller: "GamerZone",
            rating: "4.7",
            xp: "+22 XP",
            price: "₦3,599"
          }
        ].map((item, index) => (
          <motion.div
            variants={itemVariants}
            key={index}
            className="flex items-center gap-4 border border-white/10 p-2 rounded-xl bg-white/5"
          >
            <div className="text-3xl float">{item.emoji}</div>
            <div className="flex-1">
              <div className="text-base font-medium pry-ff">{item.title}</div>
              <div className="text-xs text-white/70 sec-ff">by {item.seller}</div>
              <div className="flex items-center gap-1 text-sm text-yellow-400 sec-ff">
                <Star size={14} fill="currentColor" />
                {item.rating}
              </div>
              <div className="text-xs mt-1 text-white/60 sec-ff">Review for {item.xp}</div>
            </div>
            <div className="text-right font-medium text-white sec-ff">{item.price}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly Best Seller Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-start gap-3 mt-2 text-[var(--txt-clr)] text-sm capitalize sec-ff bg-white/10 border border-white/10 backdrop-blur-md p-3 rounded-lg"
      >
        <div className="p-2 rounded-full bg-yellow-400/20 text-yellow-400">
          <Trophy size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold pry-ff">Weekly Best Seller Challenge</span>
          <p className="text-xs text-white/70 leading-snug mt-1 sec-ff">
            Complete 3 verified sales this week to earn the <span className="text-yellow-400 font-medium">Best Seller</span> badge.
          </p>
        </div>
      </motion.div>

      {/* Escrow Protection Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex items-start gap-3 mt-2 text-[var(--txt-clr)] text-sm capitalize bg-white/10 border border-white/10 backdrop-blur-md p-3 rounded-lg"
      >
        <div className="p-2 rounded-full bg-green-400/20 text-green-400">
          <Shield size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold pry-ff">Escrow Protection</span>
          <p className="text-xs text-white/70 leading-snug mt-1 sec-ff">
            <span className="text-white font-bold sec-ff">₦24,597</span> total value secured
          </p>
          <p className="text-xs text-white/70 leading-snug sec-ff">
            <span className="text-green-400 font-medium">+155 XP</span> in review rewards
          </p>
        </div>
      </motion.div>

      {/* Floating Emoji Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}