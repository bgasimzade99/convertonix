import { Sparkles, X, ArrowRight } from 'lucide-react'
import { NEW_YEAR_CAMPAIGN, isCampaignActive, getDaysRemaining } from '../config/campaign'
import { useNavigate } from 'react-router-dom'

function NewYearUpgradePrompt({ onClose, reason }) {
  const navigate = useNavigate()
  
  if (!isCampaignActive(NEW_YEAR_CAMPAIGN)) {
    return null
  }

  const daysRemaining = getDaysRemaining(NEW_YEAR_CAMPAIGN)

  const getMessage = () => {
    switch(reason) {
      case 'limit':
        return 'You\'ve reached your free conversion limit'
      case 'bulk':
        return 'Bulk conversions require Pro access'
      case 'advanced':
        return 'This format requires Pro access'
      default:
        return 'Unlock unlimited conversions'
    }
  }

  const handleUpgrade = () => {
    navigate('/pricing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (onClose) onClose()
  }

  return (
    <div className="new-year-upgrade-prompt">
      <div className="new-year-upgrade-content">
        <button 
          className="new-year-upgrade-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        
        <div className="new-year-upgrade-icon">
          <Sparkles size={32} />
        </div>
        
        <div className="new-year-upgrade-text">
          <h3>🎆 New Year Gift</h3>
          <p className="upgrade-message">{getMessage()}</p>
          <p className="upgrade-offer">
            Unlock unlimited conversions for all of 2026 with one payment. No monthly fees.
          </p>
          {daysRemaining > 0 && (
            <p className="upgrade-timer">
              Limited time: Ends in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </p>
          )}
        </div>
        
        <button 
          className="new-year-upgrade-cta"
          onClick={handleUpgrade}
        >
          Unlock New Year Deal
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default NewYearUpgradePrompt

