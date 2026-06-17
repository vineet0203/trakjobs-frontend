import { useState, useEffect } from 'react';
import { Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../../auth/hooks/useAuth';

const ProfileMenu = ({ user }) => {
  const { logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Handle menu opening/closing with animations
  useEffect(() => {
    if (isProfileMenuOpen) {
      // Opening
      setIsClosing(false);
      setShouldShowMenu(true);
    } else {
      // Closing
      if (shouldShowMenu) {
        setIsClosing(true);
        // Wait for animation to complete before removing from DOM
        const timer = setTimeout(() => {
          setShouldShowMenu(false);
          setIsClosing(false);
        }, 200); // Match animation duration
        return () => clearTimeout(timer);
      }
    }
  }, [isProfileMenuOpen, shouldShowMenu]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.first_name && user?.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get user role display
  const getUserRole = () => {
    if (user?.primary_role) {
      return user.primary_role
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    if (user?.role_slugs?.length > 0) {
      return user.role_slugs[0]
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'User';
  };

  const handleLogout = async () => {
    try {
      setIsProfileMenuOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Determine which animation to apply
  const getAnimationClass = () => {
    if (isClosing) return 'animate-fade-out';
    if (shouldShowMenu) return 'animate-fade-in';
    return '';
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <div
        className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors"
        onClick={toggleMenu}
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-semibold text-sm">
          {getUserInitials()}
        </div>
        <div className="flex flex-col min-w-[100px]">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
            {getDisplayName()}
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap">{getUserRole()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu with Animation */}
      {shouldShowMenu && (
        <>
          {/* Backdrop for clicking outside */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsProfileMenuOpen(false)}
          ></div>

          {/* Dropdown Menu */}
          <div 
            className={`absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 
                      ${getAnimationClass()}`}
            style={{ transformOrigin: 'top' }}
          >
            {/* User Info Section */}
            <div className="px-4 py-6 border-b border-gray-100 flex flex-col items-center text-center">
              {/* Initials Circle - Larger */}
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-semibold text-xl mb-3 shadow-md">
                {getUserInitials()}
              </div>

              {/* User Details */}
              <p className="text-base font-semibold text-gray-900">{getDisplayName()}</p>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

              {/* Vendor Info - If Available */}
              {user?.vendor && (
                <div className="mt-3 w-full">
                  <p className="text-sm font-medium text-gray-700 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                    {user.vendor.business_name}
                  </p>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                disabled={true}
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  window.location.href = '/profile';
                }}
                className="w-full px-4 py-2 text-sm text-gray-400 flex items-center gap-3 cursor-not-allowed opacity-60"
                title="Coming soon"
              >
                <User className="w-4 h-4 text-gray-400" />
                Your Profile
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
              </button>

              <button
                disabled={true}
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  window.location.href = '/settings';
                }}
                className="w-full px-4 py-2 text-sm text-gray-400 flex items-center gap-3 cursor-not-allowed opacity-60"
                title="Coming soon"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Settings
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
              </button>
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;