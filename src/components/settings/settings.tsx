'use client';

import { useState } from 'react';
import SettingsSidebar from './settings-sidebar';
import ProfileSettings from './profile-settings';
import AccountSettings from './account-settings';
import NotificationSettings from './notif-settings';
import SecuritySettings from './security-settings';

export type SettingsFormData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<SettingsFormData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    bio: 'Software Developer passionate about building great products.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    twoFactorEnabled: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (section: string) => {
    // Handle save logic here
    console.log(`Saving ${section}:`, formData);
    // Show success toast
  };

  const renderActiveTab = () => {
    const commonProps = {
      formData,
      handleInputChange,
      handleSave,
    };

    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'account':
        return <AccountSettings {...commonProps} />;
      case 'notifications':
        return <NotificationSettings {...commonProps} />;
      case 'security':
        return <SecuritySettings {...commonProps} />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[var(--acc-clr)] pry-ff mb-2">Settings</h1>
        <p className="text-[var(--txt-clr)] sec-ff">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1">
          <div className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </main>
  );
}