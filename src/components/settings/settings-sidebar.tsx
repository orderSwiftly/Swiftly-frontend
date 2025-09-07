import { User, Lock, Bell, Shield } from 'lucide-react';

type SettingsSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <nav className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 sec-ff ${
              activeTab === id
                ? 'bg-[var(--acc-clr)] text-white shadow-md'
                : 'text-[var(--txt-clr)] hover:bg-white/10'
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}