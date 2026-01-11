import logo from '../assets/ktrainer-logo.png'
import Navigation from './Navigation'

function Header({ title, onHomeClick, currentView, onNavigate, onLogout, user }) {
  return (
    <div id="header" className="px-4 py-3 flex-shrink-0 bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Logo and title on the left */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Kettlebell Tracker Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </button>

        {/* Navigation on the right */}
        <Navigation
          currentView={currentView}
          onNavigate={onNavigate}
          onLogout={onLogout}
          user={user}
        />
      </div>
    </div>
  )
}

export default Header
