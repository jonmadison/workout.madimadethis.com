import { useState, useEffect, useRef } from 'react';
import { logoutUser } from '../services/authService';

function Navigation({ currentView, onNavigate, onLogout, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      const result = await logoutUser();
      if (result.success) {
        onLogout();
      } else {
        alert('Failed to log out. Please try again.');
      }
    }
    setIsOpen(false);
  };

  const handleNavigate = (view) => {
    onNavigate(view);
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'library', label: 'My Workouts', icon: '📝' },
  ];

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (user?.attributes?.given_name) {
      return user.attributes.given_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="User menu"
      >
        {getUserInitials()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* Menu Items */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {currentView === item.id && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Navigation;
