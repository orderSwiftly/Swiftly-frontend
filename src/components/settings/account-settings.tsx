"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SettingsFormData } from './settings';
import useLogout from '@/hooks/logout';
import toast from 'react-hot-toast';
import PulseLoader from '../pulse-loader';

type AccountSettingsProps = {
  formData: SettingsFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleSave: (section: string) => void;
};

export default function AccountSettings({ formData, handleInputChange, handleSave }: AccountSettingsProps) {
  const logout = useLogout();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');

      const res = await fetch(`${api_url}/api/v1/user/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      setShowConfirmModal(false);
      logout(); // clears token and redirects to /login

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--acc-clr)] pry-ff mb-2">Account Settings</h2>
        <p className="text-[var(--pry-clr)] sec-ff">Manage your account preferences and password.</p>
      </div>

      <div className="space-y-8">
        {/* Danger Zone */}
        <div>
          <h3 className="text-lg font-semibold text-red-500 pry-ff mb-4">Danger Zone</h3>
          <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-red-500 mb-1 sec-ff">Delete Account</h4>
                <p className="text-sm text-red-600 sec-ff">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 bg-red-600 text-[var(--txt-clr)] rounded-md hover:bg-red-700 transition-colors font-medium ml-4 sec-ff"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ───────────────────────── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-red-600 pry-ff mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 sec-ff mb-6">
              Are you sure you want to permanently delete your account? This action
              <strong> cannot be undone</strong> and all your data will be removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm sec-ff hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm sec-ff font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? <PulseLoader /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}