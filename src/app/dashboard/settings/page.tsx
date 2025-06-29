'use client';

import { useState } from 'react';
import useLogout from '@/hooks/logout';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const logout = useLogout();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/auth/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Password updated!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(data.message ?? 'Reset failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] p-6 pt-[70px]">
      <div className="max-w-xl mx-auto bg-[var(--bg-clr)] p-6 rounded-lg shadow-md pry-ff text-[var(--txt-clr)]">
        <h1 className="text-2xl font-bold mb-6 text-[var(--acc-clr)]">Account Settings</h1>

        {/* Reset Password */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Reset Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 text-[var(--txt-clr)] outline-none placeholder:text-white/60"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 text-[var(--txt-clr)] outline-none placeholder:text-white/60"
            />
            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className="bg-[var(--acc-clr)] text-[var(--bg-clr)] font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Logout */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Logout</h2>
          <button
            onClick={logout}
            className="bg-red-500/90 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}