import { Crown, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function UsageTracker({ onUpgradeClick }) {
  const { user, isPremium, getRemainingConversions } = useAuth()
  
  if (isPremium) {
    return (
      <div className="usage-tracker premium">
        <Crown size={20} />
        <span>Premium - Unlimited Conversions</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="usage-tracker">
        <div className="usage-info">
          <Zap size={20} />
          <span>Sign in to get 100 free conversions!</span>
        </div>
      </div>
    )
  }

  const remaining = getRemainingConversions()

  return (
    <div className={`usage-tracker ${remaining === 0 ? 'limit-reached' : ''}`}>
      <div className="usage-info">
        <Zap size={20} />
        <span>
          {remaining > 0 
            ? `${remaining} free conversion${remaining !== 1 ? 's' : ''} remaining`
            : 'Conversion limit reached'}
        </span>
      </div>
      {remaining <= 5 && (
        <button className="btn-upgrade" onClick={onUpgradeClick}>
          Upgrade to Premium
        </button>
      )}
    </div>
  )
}

export default UsageTracker

