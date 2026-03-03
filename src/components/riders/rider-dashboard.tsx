import EarningsCard from "./earning-card";
import StatsGrid from "./stats-grid";

export default function RiderDashboard() {
    return (
        <div className="min-h-screen">
            <main className="p-4">
                <EarningsCard />
                <StatsGrid />
            </main>
        </div>
    );
}