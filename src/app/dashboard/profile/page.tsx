import ProfileComponent from "@/components/profile-component";
import SidebarNav from "@/components/sidebar-nav";

export default function SettingsPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] px-4 md:pb-10">
      {/* Header */}
      <SidebarNav />

      {/* Profile Component */}
      <ProfileComponent />
    </main>
  );
}