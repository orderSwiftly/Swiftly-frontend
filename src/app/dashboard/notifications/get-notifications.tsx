'use client';

import { useEffect, useState } from 'react';

type Notification = {
  _id: string;
  userId: string;
  message: string;
  resourceType: string;
  relatedResourceId: string;
  isRead: boolean;
  createdAt: string;
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/notification/user/get-notifications`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.status === 'success') {
        setNotifications(data.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/notification/user/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.status === 'success') {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-center text-[var(--sec-clr)]">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-[var(--txt-clr)] pry-ff">No notifications found.</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 rounded-xl border-l-4 shadow-md backdrop-blur-md transition duration-200 hover:scale-[1.01] ${
              notif.isRead
                ? 'bg-[var(--light-bg)]/70 border-transparent'
                : 'bg-[var(--light-bg)]/80 border-[var(--acc-clr)]'
            }`}
          >
            {/* Left Side */}
            <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
              <input type="checkbox" className="accent-[var(--acc-clr)] mt-1 sm:mt-0" />

              <img
                src="/default-avatar.jpg"
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex flex-col sec-ff">
                <p className="text-sm leading-snug text-[var(--txt-clr)]">
                  <span className="font-semibold text-[var(--acc-clr)]">You</span>{' '}
                  {notif.message.replace(/Jonathon Smith/i, '')}
                </p>
                <p className="text-xs text-[var(--sec-clr)] sec-ff">{getTimeAgo(notif.createdAt)}</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 justify-end sm:justify-start sec-ff">
              <span
                className={`text-sm font-medium ${
                  notif.isRead ? 'text-[var(--sec-clr)]' : 'text-[var(--acc-clr)]'
                }`}
              >
                {notif.isRead ? 'Read' : 'Unread'}
              </span>

              {!notif.isRead && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="px-4 py-1.5 text-sm rounded-md font-medium whitespace-nowrap bg-[#1E2C3B] hover:bg-[#243545]"
                  style={{
                    color: 'var(--txt-clr)',
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsList;