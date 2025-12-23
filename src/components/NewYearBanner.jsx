import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { NEW_YEAR_CAMPAIGN, isCampaignActive, getDaysRemaining } from '../config/campaign'
import { useNavigate } from 'react-router-dom'

function NewYearBanner({ onClose }) {
  const navigate = useNavigate()
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isCampaignActive(NEW_YEAR_CAMPAIGN)) {
      setIsVisible(false)
      return
    }

    const updateCountdown = () => {
      const days = getDaysRemaining(NEW_YEAR_CAMPAIGN)
      setDaysRemaining(days)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(interval)
  }, [])

  if (!isVisible || !isCampaignActive(NEW_YEAR_CAMPAIGN)) {
    return null
  }

  const handleCTAClick = () => {
    if (window.location.pathname === '/pricing') {
      // Already on pricing page, scroll to pricing plans section
      setTimeout(() => {
        const pricingSection = document.querySelector('.pricing-plans')
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      // Navigate to pricing page and scroll to plans
      navigate('/pricing')
      setTimeout(() => {
        const pricingSection = document.querySelector('.pricing-plans')
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }

  return (
    <div className="new-year-banner">
      <div className="new-year-banner-content">
        <div className="new-year-banner-icon">
          <Sparkles size={24} />
        </div>
        <div className="new-year-banner-text">
          <div className="new-year-banner-title">{NEW_YEAR_CAMPAIGN.banner.title}</div>
                  <div className="new-year-banner-subtitle">Unlock unlimited conversions for all of 2026 with one payment</div>
        </div>
        {daysRemaining > 0 && (
          <div className="new-year-countdown">
            <span className="countdown-label">Ends in</span>
            <span className="countdown-value">{daysRemaining}</span>
            <span className="countdown-unit">{daysRemaining === 1 ? 'day' : 'days'}</span>
          </div>
        )}
        <button 
          className="new-year-banner-cta"
          onClick={handleCTAClick}
        >
          {NEW_YEAR_CAMPAIGN.banner.cta}
          <ArrowRight size={16} />
        </button>
        {onClose && (
          <button 
            className="new-year-banner-close"
            onClick={onClose}
            aria-label="Close banner"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default NewYearBanner

