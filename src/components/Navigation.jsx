import { logoutUser } from '../services/authService';

function Navigation({ currentView, onNavigate, onLogout }) {
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
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'calendar', label: 'Calendar' },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === item.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          {item.label}
        </button>
      ))}

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-900 hover:bg-red-100 hover:text-red-700 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navigation;
