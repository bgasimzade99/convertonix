import { useState, useEffect } from 'react'
import { X, Check, Crown, Zap, Rocket, Users, Star, ArrowRight, Shield, Clock, CreditCard, Sparkles } from 'lucide-react'
import { NEW_YEAR_CAMPAIGN, isCampaignActive, getDaysRemaining } from '../config/campaign'

function PricingModal({ onClose, onPurchase }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [showCampaign, setShowCampaign] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    const campaignActive = isCampaignActive(NEW_YEAR_CAMPAIGN)
    setShowCampaign(campaignActive)
    if (campaignActive) {
      setDaysRemaining(getDaysRemaining(NEW_YEAR_CAMPAIGN))
    }
  }, [])

  const buildPlans = () => {
    const basePlans = [
      {
        id: 'free',
        name: "Free",
        tagline: "Try Convertonix",
        price: "$0",
        period: "forever",
        icon: <Zap size={28} />,
        popular: false,
        features: [
          "20 conversions per month",
          "Popular formats",
          "Standard AI processing",
          "Files auto-deleted after 24h",
          "Community support"
        ],
        buttonText: "Continue Free",
        buttonStyle: "btn-outline",
        note: "No credit card required"
      }
    ]

    // Add New Year campaign plan if active
    if (showCampaign && isCampaignActive(NEW_YEAR_CAMPAIGN)) {
      const campaignPlan = {
        id: 'newyear',
        name: NEW_YEAR_CAMPAIGN.plan.name,
        tagline: NEW_YEAR_CAMPAIGN.plan.tagline,
        price: `$${NEW_YEAR_CAMPAIGN.plan.price}`,
        period: NEW_YEAR_CAMPAIGN.plan.duration,
        icon: <Sparkles size={28} />,
        popular: true,
        campaign: true,
        badge: NEW_YEAR_CAMPAIGN.plan.badge,
        features: NEW_YEAR_CAMPAIGN.plan.features,
        buttonText: NEW_YEAR_CAMPAIGN.plan.buttonText,
        buttonStyle: "btn-primary",
        savings: daysRemaining > 0 ? `Ends in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}` : null
      }
      basePlans.push(campaignPlan)
    }

    // Add standard Pro plan
    basePlans.push({
      id: 'pro',
      name: "Pro",
      tagline: "Most Popular",
      price: billingPeriod === 'yearly' ? "$7" : "$8",
      period: billingPeriod === 'yearly' ? "/mo billed yearly" : "/month",
      icon: <Crown size={28} />,
      popular: !showCampaign,
      badge: !showCampaign ? "BEST VALUE" : null,
      features: [
        { text: "Unlimited conversions", highlight: true },
        { text: "All 100+ formats", highlight: true },
        { text: "Faster AI processing", highlight: true },
        { text: "Priority queue", highlight: false },
        { text: "Instant file deletion", highlight: false },
        { text: "No ads", highlight: false }
      ],
      buttonText: "Upgrade to Pro",
      buttonStyle: "btn-primary",
      savings: billingPeriod === 'yearly' ? "2 months free" : null
    })

    // Add Power User plan
    basePlans.push({
      id: 'power',
      name: "Power User",
      tagline: "For Professionals",
      price: billingPeriod === 'yearly' ? "$12" : "$15",
      period: billingPeriod === 'yearly' ? "/mo billed yearly" : "/month",
      icon: <Rocket size={28} />,
      popular: false,
      features: [
        { text: "Everything in Pro", highlight: false },
        { text: "Bulk conversions (up to 100)", highlight: true },
        { text: "Larger files (up to 500MB)", highlight: true },
        { text: "API access", highlight: true },
        { text: "Early access to new features", highlight: false },
        { text: "Priority support", highlight: false }
      ],
      buttonText: "Upgrade to Power",
      buttonStyle: "btn-outline",
      savings: billingPeriod === 'yearly' ? "2 months free" : null
    })

    return basePlans
  }

  const plans = buildPlans()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pricing-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="pricing-modal-header">
          <h2>Upgrade Your Plan</h2>
          <p className="modal-subtitle">
            {showCampaign 
              ? "Unlock unlimited conversions for all of 2026 with one payment."
              : "Get unlimited conversions, faster AI processing, and all premium features."
            }
          </p>
          
          {/* Billing Toggle - Hide during campaign */}
          {!showCampaign && (
            <div className="pricing-toggle-wrapper">
              <div className="pricing-toggle">
                <button 
                  className={billingPeriod === 'monthly' ? 'active' : ''}
                  onClick={() => setBillingPeriod('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={billingPeriod === 'yearly' ? 'active' : ''}
                  onClick={() => setBillingPeriod('yearly')}
                >
                  Yearly
                  <span className="yearly-badge">2 months free</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pricing-cards">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'featured' : ''} ${plan.campaign ? 'campaign-card' : ''}`}
            >
              {plan.badge && (
                <div className={`popular-badge ${plan.campaign ? 'campaign-badge' : ''}`}>
                  {plan.campaign ? <Sparkles size={14} /> : <Star size={14} />}
                  {plan.badge}
                </div>
              )}
              
              <div className="pricing-icon">
                {plan.icon}
              </div>
              
              <div className="pricing-card-header">
                <h3>{plan.name}</h3>
                {plan.tagline && <p className="pricing-tagline">{plan.tagline}</p>}
                <div className="price">
                  {plan.price}
                  {plan.period && <span>/{plan.period.includes('forever') ? '' : plan.period}</span>}
                </div>
                {plan.savings && (
                  <div className="savings-text">{plan.savings}</div>
                )}
              </div>
              
              <ul className="features">
                {plan.features.map((feature, idx) => {
                  const featureText = typeof feature === 'string' ? feature : feature.text
                  const isHighlight = typeof feature === 'object' && feature.highlight
                  return (
                    <li key={idx} className={isHighlight ? 'feature-highlight' : ''}>
                      <Check size={16} />
                      <span>{featureText}</span>
                    </li>
                  )
                })}
              </ul>
              
              <button 
                className={`${plan.buttonStyle} ${plan.campaign ? 'campaign-button' : ''}`} 
                onClick={() => plan.id === 'free' ? onClose() : onPurchase(plan.id)}
              >
                {plan.buttonText}
                {plan.id !== 'free' && <ArrowRight size={16} />}
              </button>
              
              {plan.note && (
                <p className="pricing-note">{plan.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="pricing-trust-signals">
          <div className="trust-signal-item">
            <Shield size={16} />
            <span>No hidden fees</span>
          </div>
          <div className="trust-signal-item">
            <Clock size={16} />
            <span>Cancel anytime</span>
          </div>
          <div className="trust-signal-item">
            <CreditCard size={16} />
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        <p className="pricing-footer-note">
          💳 Secure payment powered by Stripe
        </p>
      </div>
    </div>
  )
}

export default PricingModal
