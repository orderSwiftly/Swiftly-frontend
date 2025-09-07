import { Check, X, Trash2 } from 'lucide-react';
import { SettingsFormData } from './settings';

type SecuritySettingsProps = {
  readonly formData: SettingsFormData;
  readonly handleInputChange: (field: string, value: string | boolean) => void;
};

export default function SecuritySettings({ formData, handleInputChange }: SecuritySettingsProps) {
  const activeSessions = [
    { device: 'Chrome on Windows', location: 'Lagos, Nigeria', current: true },
    { device: 'Safari on iPhone', location: 'Lagos, Nigeria', current: false },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff mb-2">Security Settings</h2>
        <p className="text-[var(--txt-clr)] sec-ff">Manage your account security and authentication.</p>
      </div>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[var(--txt-clr)] pry-ff">Two-Factor Authentication</h3>
              <p className="text-sm text-[var(--txt-clr)]/70 sec-ff mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-2 text-sm font-medium ${
                formData.twoFactorEnabled ? 'text-green-400' : 'text-gray-400'
              }`}>
                {formData.twoFactorEnabled ? <Check size={16} /> : <X size={16} />}
                {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={() => handleInputChange('twoFactorEnabled', !formData.twoFactorEnabled)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  formData.twoFactorEnabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-[var(--acc-clr)] text-white hover:opacity-90'
                }`}
              >
                {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>

        {/* Login Sessions */}
        <div>
          <h3 className="font-medium text-[var(--txt-clr)] pry-ff mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {activeSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                <div>
                  <p className="font-medium text-[var(--txt-clr)] sec-ff">{session.device}</p>
                  <p className="text-sm text-[var(--txt-clr)]/70 sec-ff">{session.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  {session.current && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Current</span>
                  )}
                  {!session.current && (
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}