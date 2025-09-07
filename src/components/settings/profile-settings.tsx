import { User } from 'lucide-react';
import { SettingsFormData } from './settings';

type ProfileSettingsProps = {
  formData: SettingsFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleSave: (section: string) => void;
};

export default function ProfileSettings({ formData, handleInputChange, handleSave }: ProfileSettingsProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-[var(--acc-clr)] rounded-full flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff">Profile Information</h2>
          <p className="text-[var(--txt-clr)] sec-ff">Update your personal information and profile details.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--txt-clr)] mb-2 sec-ff">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-[var(--txt-clr)] focus:border-[var(--acc-clr)] focus:outline-none resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleSave('profile')}
            className="px-6 py-2 bg-[var(--acc-clr)] text-white rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}