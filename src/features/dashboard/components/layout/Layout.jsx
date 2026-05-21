import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px] min-w-0">
        <Header />
        <main className="flex-1 px-6 py-3 bg-gray-50 overflow-y-auto">
          <div className="max-w-full mx-auto"> {/* Added wrapper container */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;