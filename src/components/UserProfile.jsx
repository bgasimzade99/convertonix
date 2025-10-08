import { useState, useRef, useEffect } from 'react'
import { User, Crown, LogOut, Settings, History, Zap, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function UserProfile({ onShowHistory, onShowPricing }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, signOut, isPremium, getRemainingConversions } = useAuth()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const remainingConversions = getRemainingConversions()

  return (
    <div className="user-profile" ref={dropdownRef}>
      <button 
        className="user-profile-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={user.avatar} 
          alt={user.name}
          className="user-avatar"
        />
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-plan">
            {isPremium ? (
              <>
                <Crown size={14} />
                Premium
              </>
            ) : (
              'Free Plan'
            )}
          </span>
        </div>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="dropdown-avatar"
            />
            <div className="dropdown-user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="plan-badge">
                {isPremium ? (
                  <>
                    <Crown size={14} />
                    Premium Member
                  </>
                ) : (
                  <>
                    <User size={14} />
                    Free Plan
                  </>
                )}
              </div>
            </div>
          </div>

          {!isPremium && remainingConversions >= 0 && (
            <div className="usage-info">
              <div className="usage-bar">
                <div 
                  className="usage-fill"
                  style={{ width: `${(user.conversionsUsed / user.conversionsLimit) * 100}%` }}
                ></div>
              </div>
              <p>
                ⚡ {remainingConversions} of {user.conversionsLimit} conversions remaining today
              </p>
            </div>
          )}

          <div className="dropdown-actions">
            <button 
              className="dropdown-item"
              onClick={() => {
                onShowHistory()
                setIsOpen(false)
              }}
            >
              <History size={18} />
              <span>📈 Conversion History</span>
            </button>

            <button className="dropdown-item">
              <Settings size={18} />
              <span>🔧 Settings</span>
            </button>

            {!isPremium && (
            <button 
              className="dropdown-item upgrade"
              onClick={() => {
                onShowPricing()
                setIsOpen(false)
              }}
            >
              <Crown size={18} />
              <span>💎 Upgrade to Premium</span>
              <Zap size={14} className="upgrade-icon" />
            </button>
            )}

            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-item signout"
              onClick={() => {
                signOut()
                setIsOpen(false)
              }}
            >
              <LogOut size={18} />
              <span>🚪 Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
