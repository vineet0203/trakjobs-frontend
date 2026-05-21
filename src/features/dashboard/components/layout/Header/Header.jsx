import { NAV_ITEMS } from '../../../../../utils/constants';
import { useAuth } from '../../../../auth/hooks/useAuth';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';


const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-2 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Page Title - Uncomment if needed */}
        {/* <h2 className="text-xl font-semibold text-gray-900">{getCurrentPageTitle()}</h2> */}
      </div>

      <div className="flex items-center gap-6">
        <Notifications align="right" direction="down" />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
};

export default Header;