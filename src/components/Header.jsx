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
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={location.pathname === '/features' ? 'active' : ''}
            aria-current={location.pathname === '/features' ? 'page' : undefined}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={location.pathname === '/pricing' ? 'active' : ''}
            aria-current={location.pathname === '/pricing' ? 'page' : undefined}
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className={location.pathname === '/about' ? 'active' : ''}
            aria-current={location.pathname === '/about' ? 'page' : undefined}
          >
            About
          </Link>
          
              <button 
                className="icon-btn ai-btn"
                onClick={onShowAIChat}
                title="AI File Generator"
                aria-label="Open AI File Generator"
              >
                <Wand2 size={20} />
              </button>
              
              <button 
                className="icon-btn"
                onClick={onShowHistory}
                title="Conversion History"
                aria-label="View conversion history"
              >
                <Clock size={20} />
              </button>
              
              <button 
                className="icon-btn"
                onClick={onToggleDarkMode}
                title="Toggle Dark Mode"
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
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
              <span>Sign In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

