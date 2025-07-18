import Navigation from "@/components/navigation";

export default function Leaderboard() {
  return (
    <main className="min-h-screen w-full bg-[var(--bg-clr)] text-[var(--txt-clr)] flex flex-col">
      <Navigation />
      <div className="flex flex-1 pt-24 px-4 sm:px-6 lg:px-12 gap-8 pry-ff">

        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 sticky top-24 h-fit">
          <nav className="space-y-4 text-[var(--sec-clr)] text-sm">
            <a href="#overview" className="text-[var(--acc-clr)] mb-2 text-lg">Overview</a>
            <a href="#buyer-verification" className="block hover:text-[var(--acc-clr)]">1. Buyer Verification</a>
            <a href="#rating-flow" className="block hover:text-[var(--acc-clr)]">2. Rating Flow</a>
            <a href="#escrow" className="block hover:text-[var(--acc-clr)]">3. Escrow & Dispute</a>
            <a href="#seller-gamification" className="block hover:text-[var(--acc-clr)]">4. Seller Gamification</a>
            <a href="#pickup" className="block hover:text-[var(--acc-clr)]">5. Pickup & Delivery</a>
            <a href="#returns" className="block hover:text-[var(--acc-clr)]">6. Complaints & Returns</a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 space-y-10 scroll-smooth" id="how-it-works">
          <h1 className="text-[var(--acc-clr)] text-3xl font-bold" id="overview">How Tredia Works</h1>

          <div className="space-y-4 sec-ff">
            <p>
              <strong className="text-[var(--txt-clr)]">Tredia – Where Trust Meets Trade</strong><br />
              Tredia is a next-gen peer-to-peer marketplace designed to solve three major pain points in online commerce:
            </p>
            <ul className="list-disc list-inside text-[var(--sec-clr)]">
              <li>Inaccurate or fake reviews</li>
              <li>`What I ordered vs what I got` complaints</li>
              <li>Clunky or exploitative return processes</li>
            </ul>
            <p>
              By combining a progressive trust-staking system, verified identity layers, escrow payments,
              gamified accountability, and community-driven resolution, Tredia introduces a trust-first commerce engine—built
              especially for university markets and beyond.
            </p>
          </div>

          <div id="buyer-verification">
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">1. Buyer Verification & Accountability</h2>
            <p className="text-[var(--sec-clr)] sec-ff">
              Buyers are tied to verified student emails to limit burner accounts and ensure credibility. Only verified purchasers
              can leave product ratings. Ratings are locked until delivery confirmation. Minimum platform spend is required
              before a rating affects public scores.
            </p>
          </div>

          <div id="rating-flow">
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">2. Buyer Rating Flow</h2>
            <ul className="list-disc list-inside text-[var(--sec-clr)] sec-ff">
              <li>Rate within 7 days of delivery to make new purchases.</li>
              <li>Auto-reminders sent 24 hours before deadline.</li>
              <li>`Skip & Explain` available — abuse penalized.</li>
              <li>Rewards: XP, coupons, or cashback.</li>
            </ul>
            <p className="text-[var(--sec-clr)]">Trust scores update every 7 days.</p>
          </div>

          <div id="escrow">
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">3. Escrow + Dispute Resolution</h2>
            <ul className="list-disc list-inside text-[var(--sec-clr)] sec-ff">
              <li>Funds held until buyer confirms satisfaction.</li>
              <li>Buyers submit complaints within 48 hours with evidence.</li>
              <li>Refunds require return or proof of damage.</li>
              <li>Complex issues go to paid, anonymous jurors based on experience.</li>
            </ul>
          </div>

          <div id="seller-gamification">
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">4. Seller Gamification & Safeguards</h2>
            <ul className="list-disc list-inside text-[var(--sec-clr)] sec-ff">
              <li>High trust = lower platform fees, better visibility.</li>
              <li>Reputation is easier to lose than gain.</li>
              <li>Flagged or inactive sellers experience score decay.</li>
            </ul>
          </div>

          <div id="pickup">
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">5. Pickup & Delivery Integrity</h2>
            <p className="text-[var(--sec-clr)] sec-ff">
              High-risk transactions can use approved public locations with QR code verification.
              Sellers can opt out if concerned about safety.
            </p>
          </div>

          <div id="returns">
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">6. Complaint and Return Handling</h2>
            <p className="text-[var(--sec-clr)] sec-ff">
              Complaints must be filed during escrow with photo/video proof. If buyers simply change their minds,
              returns are allowed as long as the item is intact and escrow is still active.
            </p>
          </div>

          <footer className="pt-8 text-[var(--txt-clr)] font-medium sec-ff">
            Tredia is built for a culture of accountability, trust, and transparency.
            Every feature nudges users toward fairer, safer, and more rewarding digital trade.
          </footer>
        </section>
      </div>
    </main>
  );
}
