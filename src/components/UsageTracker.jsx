import { Crown, Zap } from 'lucide-react'

function UsageTracker({ count, isPremium, onUpgradeClick }) {
  if (isPremium) {
    return (
      <div className="usage-tracker premium">
        <Crown size={20} />
        <span>Premium - Unlimited Conversions</span>
      </div>
    )
  }

  const remaining = 2 - count

  return (
    <div className={`usage-tracker ${remaining === 0 ? 'limit-reached' : ''}`}>
      <div className="usage-info">
        <Zap size={20} />
        <span>
          {remaining > 0 
            ? `${remaining} free conversion${remaining !== 1 ? 's' : ''} remaining today`
            : 'Daily limit reached'}
        </span>
      </div>
      {remaining <= 1 && (
        <button className="btn-upgrade" onClick={onUpgradeClick}>
          Upgrade to Premium
        </button>
      )}
    </div>
  )
}

export default UsageTracker

