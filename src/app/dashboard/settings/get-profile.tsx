'use client';

import { useState, useEffect } from 'react';

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
    <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg space-y-4">
      {loading ? (
        <p className="text-[var(--txt-clr)] text-lg">Loading profile...</p>
      ) : profile ? (
        <>
          <h1 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">
            {profile.fullname}
          </h1>
          <div className="space-y-2">
            <p className="text-[var(--txt-clr)] sec-ff">
              <span className="font-semibold text-gray-400">Email:</span> {profile.email}
            </p>
            <p className="text-[var(--txt-clr)] sec-ff capitalize">
              <span className="font-semibold text-gray-400">Role:</span> {profile.role}
            </p>
          </div>
        </>
      ) : (
        <p className="text-red-500 text-lg">Failed to load profile.</p>
      )}
    </div>
  );
}
