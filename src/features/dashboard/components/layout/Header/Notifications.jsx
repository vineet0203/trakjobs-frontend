import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import httpClient from '../../../../../services/api/httpClient';

const Notifications = ({ align = 'right', direction = 'down', customTrigger }) => {
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
                    <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${direction === 'up' ? 'bottom-full mb-2' : 'mt-2'} w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50`}>
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    <CheckCheck className="w-3 h-3" /> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-400">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-400">No notifications</div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => !n.is_read && markRead(n.id)}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${!n.is_read ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-sm font-medium text-gray-800">{n.title}</p>
                                            {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;