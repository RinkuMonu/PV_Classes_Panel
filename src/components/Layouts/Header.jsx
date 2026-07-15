import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  UserCog, 
  LogOut,
  PanelRightOpen,
  PanelLeftClose
} from "lucide-react";
import { Link } from 'react-router-dom'; // or use <a> tags if not using React Router

// Changed: Header now also controls desktop sidebar collapse.
const Header = ({ toggleSidebar, toggleDesktopSidebar, isSidebarCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center mb-6 mt-4 px-4 relative">
      <div className="flex items-center space-x-4">
        {/* Existing mobile sidebar button: visible only on small screens. */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden"
          title="Open sidebar"
        >
          <Menu
            size={24}
            className="text-gray-700 cursor-pointer hover:text-[#87b105] transition-colors duration-200"
          />
        </button>

        {/* Added: desktop-only sidebar collapse button. */}
        <button
          type="button"
          onClick={toggleDesktopSidebar}
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelRightOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>
      <div className="flex items-center space-x-4">

        <Link to="/notification">
        <Bell size={20} className="text-gray-500 hover:text-[#87b105] cursor-pointer transition-colors duration-200" />
        </Link>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center space-x-1 cursor-pointer"
            onClick={toggleProfile}
          >
            <User size={24} className="text-gray-700 hover:text-[#87b105] transition-colors duration-200" />
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              {/* <Link 
                to="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                Dashboard
              </Link> */}
              <Link 
                to="/edit-profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                <UserCog className="mr-3 h-4 w-4" />
                Edit Profile
              </Link>
              <Link 
                to="/login"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {setIsProfileOpen(false);localStorage.removeItem('token');}}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
