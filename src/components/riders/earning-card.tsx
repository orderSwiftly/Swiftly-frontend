export default function EarningsCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            {/* Wave decoration */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                <svg viewBox="0 0 400 180" className="absolute top-0 right-0 w-full opacity-100" preserveAspectRatio="xMaxYMin slice">
                    <path d="M200,0 Q280,40 400,20 L400,0 Z" fill="#3a7d0a" opacity="0.9" />
                    <path d="M160,0 Q260,60 400,35 L400,0 Z" fill="#4e9c0e" opacity="0.7" />
                    <path d="M220,0 Q320,50 400,55 L400,0 Z" fill="#6abf1a" opacity="0.5" />
                </svg>
            </div>

            <div className="relative z-10 pry-ff">
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">Today's Earnings</p>
                <p className="text-4xl font-bold text-gray-900">₦20,000</p>
            </div>
        </div>
    );
}