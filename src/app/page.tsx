import Navigation from "@/components/navigation";
import LandingPage from "@/components/landing-page";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[var(--bg-clr)] flex flex-col items-center justify-start">
      <Navigation />
      <LandingPage />
    </main>
  );
}