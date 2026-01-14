import logo from '../assets/kb.png'
import Navigation from './Navigation'

function Header({ title, onHomeClick, currentView, onNavigate, onLogout, user }) {
  return (
    <div id="header" className="px-4 pt-2 flex-shrink-0" style={{ paddingBottom: '12px' }}>
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Logo and title on the left */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Kettlebell Tracker Logo" className="h-12 w-12" />
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
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
