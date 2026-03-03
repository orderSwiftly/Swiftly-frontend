interface StatCardProps {
    label: string;
    value: string;
}

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 pry-ff">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

export default function StatsGrid() {
    const stats = [
        { label: "Total Earnings", value: "₦380,485" },
        { label: "Today's Deliveries", value: "38" },
        { label: "Average Time", value: "5 min" },
        { label: "Total Deliveries", value: "380" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
        </div>
    );
}