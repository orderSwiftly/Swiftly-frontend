import GetProfile from './get-profile';
import ChangeInfo from './change-info';

export default function SettingsPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] pt-[70px] md:pl-72 px-4 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold pry-ff text-[var(--acc-clr)]">
          Account Settings
        </h1>
        <p className="text-[var(--txt-clr)] mt-2 sec-ff">
          Manage your personal information and preferences here.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile info */}
        <GetProfile />

        {/* Form or info changer */}
        <ChangeInfo />
      </div>
    </main>
  );
}