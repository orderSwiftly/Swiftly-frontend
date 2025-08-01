import GetProfile from './get-profile';
import ChangeInfo from './change-info';

export default function SettingsPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col md:flex-row gap-8 pt-[70px] md:pl-64 px-4">
      {/* Profile info */}
      <div className="w-full md:w-1/2">
        <GetProfile />
      </div>

      {/* Form or info changer */}
      <div className="w-full md:w-1/2">
        <ChangeInfo />
      </div>
    </main>
  );
}