import { SettingsFormData } from './settings';

type NotificationSettingsProps = {
  formData: SettingsFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleSave: (section: string) => void;
};

export default function NotificationSettings({ formData, handleInputChange, handleSave }: NotificationSettingsProps) {
  const notificationOptions = [
    { 
      key: 'emailNotifications', 
      label: 'Email Notifications', 
      desc: 'Receive email notifications for important updates' 
    },
    { 
      key: 'pushNotifications', 
      label: 'Push Notifications', 
      desc: 'Get push notifications on your devices' 
    },
    { 
      key: 'marketingEmails', 
      label: 'Marketing Emails', 
      desc: 'Receive newsletters and product updates' 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff mb-2">Notification Preferences</h2>
        <p className="text-[var(--txt-clr)] sec-ff">Choose what notifications you want to receive.</p>
      </div>

      <div className="space-y-6">
        {notificationOptions.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0">
            <div>
              <h3 className="font-medium text-[var(--txt-clr)] pry-ff">{label}</h3>
              <p className="text-sm text-[var(--txt-clr)]/70 sec-ff mt-1">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData[key as keyof SettingsFormData] as boolean}
                onChange={(e) => handleInputChange(key, e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                formData[key as keyof SettingsFormData] ? 'bg-[var(--acc-clr)]' : 'bg-gray-600'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out mt-1 ${
                  formData[key as keyof SettingsFormData] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </label>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            onClick={() => handleSave('notifications')}
            className="px-6 py-2 bg-[var(--acc-clr)] text-white rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}