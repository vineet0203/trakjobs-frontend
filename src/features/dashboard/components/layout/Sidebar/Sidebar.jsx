import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../../../../utils/constants';
import Notifications from '../Header/Notifications';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Calendar,
  Receipt,
  Clock,
  BookOpen,
  BarChart3,
  Settings,
  Clock10,
  Calendar1Icon,
  Book,
  Quote,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Bell,
  MessageSquare,
} from 'lucide-react';
import UnreadBadge from '../../../../messages/components/UnreadBadge';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSubmenu = (path) => {
    setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Check if a parent's submenu should be considered active
  const isParentActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => location.pathname.startsWith(child.path));
  };

  const icons = {
    dashboard: <LayoutDashboard size={18} />,
    customers: <Users size={18} />,
    quotes: <Quote size={18} />,
    jobs: <Briefcase size={18} />,
    schedule: <Calendar size={18} />,
    invoices: <Receipt size={18} />,
    timesheets: <Calendar1Icon size={18} />,
    booking: <Calendar size={18} />,
    employees: <Users size={18} />,
    onboarding: <ClipboardCheck size={18} />,
    reports: <BarChart3 size={18} />,
    settings: <Settings size={18} />,
    notifications: <Bell size={18} />,
    messages: <MessageSquare size={18} />,
  };

  const getIcon = (iconName) => icons[iconName] || icons.dashboard;

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'John Doe', role: 'Service Provider' };
  const displayName = user.full_name || user.name || (user.vendor ? user.vendor.business_name : 'John Doe');
  const displayRole = user.primary_role ? user.primary_role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : (user.role || 'Service Provider');

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200 z-50 flex flex-col">
      {/* Sidebar Header */}
      <div className="w-full h-[76px] flex items-center pl-6 border-b border-slate-100">
        <h1 className="font-bold text-2xl text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-[#ffb800] text-white flex items-center justify-center text-sm font-extrabold">T</span>
          Trak<span className="text-[#ffb800]">Jobs</span>
        </h1>
      </div>

      {/* Profile Card */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Online
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`} alt="User" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{displayRole}</p>
            {user.vendor && (user.vendor.service_category || user.vendor.service_sub_category) && (
              <p className="text-[10px] font-medium text-[#ffb800] bg-orange-50 border border-orange-100 rounded px-1.5 py-0.5 mt-1 inline-block truncate max-w-full">
                {user.vendor.service_sub_category
                  ? user.vendor.service_sub_category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  : user.vendor.service_category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = openMenus[item.path] || isParentActive(item);

          if (item.isComponent && item.icon === 'notifications') {
            return (
              <div key={item.path} className="w-full">
                <Notifications
                  align="left"
                  direction="up"
                  customTrigger={(unreadCount, toggleOpen) => (
                    <button
                      onClick={toggleOpen}
                      className="flex items-center px-4 py-3 rounded-xl gap-3 w-full cursor-pointer transition-all duration-200 no-underline text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium relative text-left"
                    >
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400">
                        {getIcon(item.icon)}
                      </div>
                      <span className="text-[14px] whitespace-nowrap flex-1">
                        {item.label}
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full text-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                  )}
                />
              </div>
            );
          }

          return (
            <div key={item.path} className="w-full">
              {/* Main nav item */}
              <NavLink
                to={item.path}
                onClick={() => {
                  if (hasChildren) {
                    toggleSubmenu(item.path);
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl gap-3 w-full cursor-pointer transition-all duration-200 no-underline ${
                    (isActive || isParentActive(item))
                      ? 'bg-orange-50 text-[#ffb800] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`
                }
              >
                <div className={`w-5 h-5 flex items-center justify-center ${
                  (isExpanded || isParentActive(item)) ? 'text-[#ffb800]' : 'text-slate-400'
                }`}>
                  {getIcon(item.icon)}
                </div>
                <span className="text-[14px] whitespace-nowrap flex-1 flex items-center justify-between">
                  {item.label}
                  {item.icon === 'messages' && <UnreadBadge />}
                </span>
                {hasChildren && (
                  <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                )}
              </NavLink>

              {/* Sub-items */}
              {hasChildren && isExpanded && (
                <div className="flex flex-col w-full mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center pl-12 pr-4 py-2.5 rounded-xl gap-3 w-full cursor-pointer transition-colors duration-200 no-underline ${
                          isActive
                            ? 'bg-orange-50 text-[#ffb800] font-semibold'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`w-4 h-4 flex items-center justify-center ${
                            isActive ? 'text-[#ffb800]' : 'text-slate-400'
                          }`}>
                            {getIcon(child.icon)}
                          </div>
                          <span className="text-[13px] whitespace-nowrap">
                            {child.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="p-5 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-3 gap-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
        >
          <div className="w-5 h-5 flex items-center justify-center text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </div>
          <span className="text-[14px]">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;