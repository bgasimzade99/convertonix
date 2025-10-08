import { Sparkles, Moon, Sun, Clock, Crown, Wand2, LogIn, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import UserProfile from './UserProfile'

function Header({ darkMode, onToggleDarkMode, onShowHistory, onShowPricing, onShowAIChat, onShowAuth, user }) {
  const location = useLocation()
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Sparkles size={36} className="logo-icon" />
          <span className="logo-text">Convertonix</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>Features</Link>
          <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>Pricing</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          
              <button 
                className="icon-btn ai-btn"
                onClick={onShowAIChat}
                title="AI File Generator"
              >
                <Wand2 size={20} />
              </button>
              
              <button 
                className="icon-btn"
                onClick={onShowHistory}
                title="Conversion History"
              >
                <Clock size={20} />
              </button>
              
              <button 
                className="icon-btn"
                onClick={onToggleDarkMode}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
          
          {user ? (
            <UserProfile 
              onShowHistory={onShowHistory}
              onShowPricing={onShowPricing}
            />
          ) : (
            <button className="btn-signin" onClick={onShowAuth}>
              <LogIn size={18} />
              🔑 Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

