import { useEffect, useState, useMemo } from 'react';
import { 
  UserPlus, 
  CalendarClock, 
  AlertTriangle, 
  RefreshCcw, 
  MessageCircle, 
  CheckCheck,
  BellRing,
  Sparkles,
  Filter
} from 'lucide-react';
import Layout from '../../components/staff/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  checkDueDateAlerts 
} from '../../services/staff/notificationService';
import { TaskCardSkeleton } from '../../components/staff/Skeleton';

const typeMeta = {
  assigned: { 
    icon: UserPlus, 
    gradient: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
    ring: 'border-blue-500/30'
  },
  due: { 
    icon: CalendarClock, 
    gradient: 'from-amber-500 to-orange-600 shadow-amber-500/20',
    ring: 'border-amber-500/30'
  },
  overdue: { 
    icon: AlertTriangle, 
    gradient: 'from-rose-500 to-red-600 shadow-rose-500/20',
    ring: 'border-rose-500/30'
  },
  status: { 
    icon: RefreshCcw, 
    gradient: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    ring: 'border-emerald-500/30'
  },
  admin: { 
    icon: MessageCircle, 
    gradient: 'from-violet-500 to-purple-600 shadow-violet-500/20',
    ring: 'border-violet-500/30'
  },
};

function formatTime(createdAt) {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Notifications() {
  const { staff } = useAuth();
  const [notifications, setNotifications] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  const staffId = staff?._id || staff?.id || staff?.staffId;

  const load = async () => {
    if (!staffId) return;
    await checkDueDateAlerts();
    const data = await fetchNotifications(staffId);
    setNotifications(data);
  };

  useEffect(() => {
    load();
  }, [staffId]);

  const handleMarkRead = async (id) => {
    const updated = await markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAll = async () => {
    if (!staffId) return;
    const updated = await markAllNotificationsRead(staffId);
    setNotifications(updated);
  };

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // Filter and Sort (Latest First)
  const processedNotifications = useMemo(() => {
    if (!notifications) return null;

    // 1. Sort latest first
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 2. Apply filter tab
    if (filter === 'unread') return sorted.filter((n) => !n.read);
    if (filter === 'read') return sorted.filter((n) => n.read);
    
    return sorted;
  }, [notifications, filter]);

  return (
    <Layout 
      title="Notifications" 
      subtitle={
        <span className="flex items-center gap-2">
          Keep track of your latest updates and task alerts.
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/20">
              {unreadCount} New
            </span>
          )}
        </span>
      }
    >
      {/* Top Header Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
            <BellRing size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Activity Stream</h2>
        </div>

        {/* Filter Controls & Mark All Read */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/50 p-1 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filter === 'read'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Read
            </button>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAll} 
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-cyan-500/90 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-95"
            >
              <CheckCheck size={16} className="transition-transform duration-300 group-hover:scale-110" /> 
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="space-y-3.5">
        {!processedNotifications ? (
          Array.from({ length: 4 }).map((_, i) => <TaskCardSkeleton key={i} />)
        ) : processedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-b from-white/60 to-white/20 p-12 text-center shadow-xl backdrop-blur-2xl dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:bg-blue-400/10">
              <Sparkles size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {filter === 'unread' ? 'No unread notifications!' : 'All caught up!'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {filter === 'unread' 
                ? 'You have read all your notifications.' 
                : "You don't have any notifications right now."}
            </p>
          </div>
        ) : (
          processedNotifications.map((n) => {
            const meta = typeMeta[n.type] || typeMeta.admin;
            const Icon = meta.icon;
            const notifId = n._id || n.id;

            return (
              <div
                key={notifId}
                onClick={() => !n.read && handleMarkRead(notifId)}
                className={`group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-3xl border p-4.5 transition-all duration-300 hover:-translate-y-0.5 sm:p-5 ${
                  !n.read 
                    ? 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent shadow-lg shadow-blue-500/5 backdrop-blur-2xl dark:border-blue-400/20 dark:from-blue-600/15 dark:via-slate-900/40 dark:to-slate-900/20' 
                    : 'border-white/20 bg-gradient-to-br from-white/70 via-white/40 to-white/20 shadow-sm backdrop-blur-xl dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/20 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {!n.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-cyan-400" />
                )}

                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${meta.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm font-bold transition-colors ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                      {n.title}
                    </p>
                    <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <div className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-md shadow-blue-500/50" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}