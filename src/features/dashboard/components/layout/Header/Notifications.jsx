import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, FileText, Briefcase, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import httpClient from '../../../../../services/api/httpClient';

const Notifications = ({ align = 'right', direction = 'down', positionMode = 'absolute', customTrigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await httpClient.get('/api/v1/notifications');
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unread_count || 0);
        } catch (e) {
            console.error('Notification fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markRead = async (id) => {
        try {
            await httpClient.post(`/api/v1/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            await httpClient.post('/api/v1/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all notifications as read', err);
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
        return `${Math.floor(diff/86400)}d ago`;
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) fetchNotifications();
    };

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'quote':
                return {
                    icon: <FileText className="w-4 h-4 text-emerald-600" />,
                    bg: 'bg-emerald-50 border border-emerald-100',
                };
            case 'job':
                return {
                    icon: <Briefcase className="w-4 h-4 text-blue-600" />,
                    bg: 'bg-blue-50 border border-blue-100',
                };
            case 'invoice':
                return {
                    icon: <DollarSign className="w-4 h-4 text-indigo-600" />,
                    bg: 'bg-indigo-50 border border-indigo-100',
                };
            case 'booking':
                return {
                    icon: <Calendar className="w-4 h-4 text-purple-600" />,
                    bg: 'bg-purple-50 border border-purple-100',
                };
            case 'system':
            case 'alert':
                return {
                    icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
                    bg: 'bg-amber-50 border border-amber-100',
                };
            default:
                return {
                    icon: <Bell className="w-4 h-4 text-slate-500" />,
                    bg: 'bg-slate-50 border border-slate-100',
                };
        }
    };

    return (
        <div className="relative w-full">
            {customTrigger ? (
                customTrigger(unreadCount, toggleOpen)
            ) : (
                <button
                    className="relative p-2 bg-none border-none cursor-pointer rounded-md hover:bg-gray-50 transition-colors"
                    onClick={toggleOpen}
                >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            )}

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}></div>
                    <div className={`${positionMode === 'fixed' ? 'fixed left-[270px] bottom-24' : `absolute ${align === 'right' ? 'right-0' : 'left-0'} ${direction === 'up' ? 'bottom-full mb-2' : 'mt-2'}`} w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-200/80 py-1.5 z-50 overflow-hidden`}>
                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-50 text-[#ffb800] border border-orange-100 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-[#ffb800] hover:text-[#e0a200] font-semibold flex items-center gap-1 transition-colors">
                                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-8 text-center text-sm text-slate-400">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="px-6 py-8 text-center flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2.5 border border-slate-100">
                                        <Bell className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                                        No new notifications at the moment.
                                    </p>
                                </div>
                            ) : (
                                notifications.map(n => {
                                    const { icon, bg } = getNotificationIcon(n.type);
                                    return (
                                        <div
                                            key={n.id}
                                            onClick={() => !n.is_read && markRead(n.id)}
                                            className={`px-4 py-3 hover:bg-slate-50/60 cursor-pointer border-b border-slate-100 flex gap-3 transition-colors duration-150 relative ${!n.is_read ? 'bg-orange-50/20' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
                                                {icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-1">
                                                    <p className={`text-xs font-semibold truncate ${!n.is_read ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                                                        {n.title}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-1 flex-shrink-0">
                                                        {timeAgo(n.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {n.message}
                                                </p>
                                            </div>
                                            {!n.is_read && (
                                                <span className="absolute right-2 top-[18px] w-1.5 h-1.5 rounded-full bg-[#ffb800] flex-shrink-0"></span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;