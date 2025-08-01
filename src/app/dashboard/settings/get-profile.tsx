'use client';

import { useState, useEffect } from 'react';
import PulseLoader from '@/components/pulse-loader';

interface UserProfile {
  fullname: string;
  email: string;
  role: string;
}

export default function GetProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(`${api_url}/api/v1/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setProfile(data.data.user);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {loading ? (
        <div className="flex items-center justify-center">
            <PulseLoader />
        </div>
      ) : profile ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold pry-ff text-[var(--acc-clr)]">
              Welcome back, {profile.fullname.split(' ')[0]} 👋
            </h2>
            <p className="text-[var(--txt-clr)] mt-2 sec-ff">
              Here’s your profile summary. Make sure your information is up to date.
            </p>
          </div>

          <div className="space-y-2 sec-ff">
            <div className="flex items-center justify-start space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-2">
              <span className="text-gray-400 font-semibold text-lg">Full Name:</span>
              <span className="text-[var(--txt-clr)] text-base">{profile.fullname}</span>
            </div>

            <div className="flex items-center justify-start space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-2">
              <span className="text-gray-400 font-semibold text-lg">Email</span>
              <span className="text-[var(--txt-clr)] text-base">{profile.email}</span>
            </div>

            <div className="flex items-center justify-start space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-2">
              <span className="text-gray-400 font-semibold text-lg">Role:</span>
              <span className="text-[var(--txt-clr)] capitalize text-base">{profile.role}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            If your profile details are incorrect, please use the form on the right to update them.
          </p>
        </div>
      ) : (
        <p className="text-red-500 text-lg">Failed to load profile.</p>
      )}
    </div>
  );
}