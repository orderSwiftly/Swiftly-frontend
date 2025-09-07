import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SettingsFormData } from './settings';

type AccountSettingsProps = {
  formData: SettingsFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleSave: (section: string) => void;
};

export default function AccountSettings({ formData, handleInputChange, handleSave }: AccountSettingsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff mb-2">Account Settings</h2>
        <p className="text-[var(--txt-clr)] sec-ff">Manage your account preferences and password.</p>
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <div className="border-b border-white/10 pb-6">
          <h3 className="text-lg font-medium text-[var(--txt-clr)] pry-ff mb-4">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt-clr)] hover:text-[var(--acc-clr)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSave('password')}
              className="px-4 py-2 bg-[var(--acc-clr)] text-white rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-lg font-medium text-red-400 pry-ff mb-4">Danger Zone</h3>
          <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-red-400 mb-1">Delete Account</h4>
                <p className="text-sm text-[var(--txt-clr)] sec-ff">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium ml-4">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}