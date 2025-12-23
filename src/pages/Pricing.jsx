import React, { useState, useEffect } from 'react'
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  Users, 
  Shield, 
  Clock,
  Sparkles,
  ArrowRight,
  CreditCard,
  Gift,
  Rocket,
  Infinity,
  TrendingUp,
  X,
  CheckCircle2
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import NewYearBanner from '../components/NewYearBanner'
import SnowEffect from '../components/SnowEffect'
import PlanFeaturesModal from '../components/PlanFeaturesModal'
import { useNavigate } from 'react-router-dom'
import { NEW_YEAR_CAMPAIGN, isCampaignActive, getDaysRemaining } from '../config/campaign'

function Pricing() {
  const navigate = useNavigate()
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' or 'yearly'
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [showCampaign, setShowCampaign] = useState(false)
  const [selectedPlanForFeatures, setSelectedPlanForFeatures] = useState(null)

  useEffect(() => {
    const campaignActive = isCampaignActive(NEW_YEAR_CAMPAIGN)
    setShowCampaign(campaignActive)
    if (campaignActive) {
      setDaysRemaining(getDaysRemaining(NEW_YEAR_CAMPAIGN))
    }
  }, [])

  const handleGetStarted = () => {
    navigate('/')
  }

  const handleStartTrial = () => {
    navigate('/')
  }

  const handleContactSales = () => {
    window.open('mailto:bgdevofficial@gmail.com?subject=Enterprise Inquiry&body=Hi, I am interested in the Enterprise plan. Please contact me.', '_blank')
  }

  const handleUpgrade = (planId) => {
    // Handle upgrade logic
    navigate('/')
  }

  // Build plans array with optional New Year campaign plan
  const buildPlans = () => {
    const basePlans = [
    {
      id: 'free',
      name: "Free",
      tagline: "Try Convertonix",
      price: "$0",
      period: "forever",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <Zap size={32} />,
      popular: false,
      highlight: false,
      features: [
        { text: "20 conversions per month", highlight: false },
        { text: "Popular formats", highlight: false },
        { text: "Standard AI processing", highlight: false },
        { text: "Files auto-deleted after 24h", highlight: false },
        { text: "Community support", highlight: false },
        { text: "Basic features", highlight: false }
      ],
      limitations: [
        "Limited format support",
        "Standard processing speed",
        "No batch conversions"
      ],
      buttonText: "Start Free",
      buttonStyle: "btn-outline",
      note: "No credit card required"
    },
    ]

    // Add New Year campaign plan if active
    if (showCampaign && isCampaignActive(NEW_YEAR_CAMPAIGN)) {
      const campaignPlan = {
        id: 'newyear',
        name: NEW_YEAR_CAMPAIGN.plan.name,
        tagline: NEW_YEAR_CAMPAIGN.plan.tagline,
        description: "One payment. Full year 2026. No monthly fees.",
        price: `$${NEW_YEAR_CAMPAIGN.plan.price}`,
        period: NEW_YEAR_CAMPAIGN.plan.duration,
        monthlyPrice: null,
        yearlyPrice: null,
        icon: <Sparkles size={32} />,
        popular: true,
        highlight: true,
        campaign: true,
        badge: NEW_YEAR_CAMPAIGN.plan.badge,
        features: [
        { text: "Unlimited conversions for 2026", highlight: true },
        { text: "All 100+ formats", highlight: true },
        { text: "Faster AI processing", highlight: true },
        { text: "Priority queue", highlight: false },
        { text: "Instant file deletion", highlight: false },
        { text: "No ads", highlight: false }
      ],
        limitations: [],
        buttonText: "Unlock 2026 Access",
        buttonStyle: "btn-primary",
        note: NEW_YEAR_CAMPAIGN.plan.description,
        daysRemaining: daysRemaining
      }
      basePlans.push(campaignPlan)
    }

    // Add standard Pro plan (always primary, most popular)
    basePlans.push({
      id: 'pro',
      name: "Pro",
      tagline: "Most Popular",
      description: "Unlimited conversions for professionals",
      price: billingPeriod === 'yearly' ? "$7" : "$8",
      period: billingPeriod === 'yearly' ? "/month billed yearly" : "/month",
      monthlyPrice: 8,
      yearlyPrice: 7,
      icon: <Crown size={32} />,
      popular: true, // Always popular
      highlight: true,
      badge: "MOST POPULAR",
      features: [
        { text: "Unlimited conversions", highlight: true },
        { text: "All 100+ formats", highlight: true },
        { text: "Faster AI processing", highlight: true },
        { text: "Priority queue", highlight: false },
        { text: "Instant file deletion", highlight: false },
        { text: "No ads", highlight: false }
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      buttonStyle: "btn-primary",
      savings: billingPeriod === 'yearly' ? "2 months free" : null
    })

    // Add Enterprise plan (premium, understated)
    basePlans.push({
      id: 'enterprise',
      name: "Enterprise",
      tagline: "For Teams",
      description: "Custom solutions for your organization",
      price: "Custom",
      period: "pricing",
      monthlyPrice: null,
      yearlyPrice: null,
      icon: <Users size={32} />,
      popular: false,
      highlight: false,
      features: [
        { text: "Everything in Pro", highlight: false },
        { text: "Custom integrations", highlight: true },
        { text: "SLA guarantee", highlight: true },
        { text: "Dedicated support", highlight: true },
        { text: "Advanced analytics", highlight: false },
        { text: "White-label solution", highlight: false }
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonStyle: "btn-outline",
      note: "Scalable for your needs"
    })

    return basePlans
  }

  const plans = buildPlans()

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! Cancel anytime with no penalties. You'll keep access until the end of your billing period."
    },
    {
      question: "What happens to my files after conversion?",
      answer: "Free plan files are auto-deleted after 24 hours. Pro and Power plans allow instant deletion. Your files never leave your device — all processing happens locally in your browser."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full — no questions asked."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Upgrades take effect immediately. Downgrades apply at the next billing cycle. All changes are instant and prorated automatically."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes! Start with the Free plan (20 conversions/month, no credit card required) to try all features. Upgrade anytime when you need more."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe."
    },
    {
      question: "What's the difference between Pro and Power User?",
      answer: "Pro is perfect for individual users who need unlimited conversions. Power User adds bulk processing, API access, larger files, and early access to new features — ideal for professionals and developers."
    },
    {
      question: "Can I switch between monthly and yearly billing?",
      answer: "Yes! Change your billing cycle anytime. Yearly billing saves you 2 months — equivalent to getting 2 months free compared to monthly."
    }
  ]

  return (
    <div className="pricing-page">
      <Particles />
      {showCampaign && <SnowEffect />}
      
      {/* New Year Campaign Banner */}
      {showCampaign && <NewYearBanner />}
      
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <div className="pricing-hero-content">
            <h1>
              {showCampaign ? 'New Year Power Deal' : 'Choose Your Plan'}
            </h1>
            {showCampaign && (
              <>
                <div className="pricing-hero-image">
                  <img src="/santa.png" alt="New Year Celebration - Join Convertonix" className="santa-image" />
                </div>
                <p className="hero-subtitle">
                  <><strong>Unlock unlimited conversions for all of 2026.</strong> One payment. No monthly fees.</>
                </p>
                <div className="pricing-hero-cta">
                  <button className="btn-primary campaign-cta-button" onClick={() => document.querySelector('.plan-card.plan-campaign')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                    Unlock 2026 Access
                    <ArrowRight size={20} />
                  </button>
                  <p className="campaign-branding">Powered by Convertonix</p>
                </div>
              </>
            )}
            {!showCampaign && (
              <p className="hero-subtitle">
                <>Start free. Upgrade when you need more. <strong>No credit card required to start.</strong></>
              </p>
            )}
            
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
        </div>
      </section>

      {/* Main Pricing Plans */}
      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid pricing-grid-4col">
            {plans.map((plan, index) => (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.highlight ? 'plan-highlight' : ''} ${plan.popular ? 'popular' : ''} ${plan.campaign ? 'plan-campaign' : ''}`}
              >
                {plan.badge && (
                  <div className={`plan-badge ${plan.campaign ? 'campaign-badge' : ''}`}>
                    {plan.campaign ? <Sparkles size={14} /> : <Star size={14} />}
                    {plan.badge}
                  </div>
                )}
                {plan.campaign && plan.daysRemaining > 0 && (
                  <div className="campaign-countdown">
                    Ends in {plan.daysRemaining} {plan.daysRemaining === 1 ? 'day' : 'days'}
                  </div>
                )}
                
                <div className="plan-header">
                  <div className="plan-icon">{plan.icon}</div>
                  <div className="plan-name-wrapper">
                    <h3 className="plan-name">{plan.name}</h3>
                    {plan.tagline && (
                      <p className="plan-tagline">{plan.tagline}</p>
                    )}
                  </div>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                    {plan.savings && (
                      <span className="savings-badge-inline">{plan.savings}</span>
                    )}
                  </div>
                </div>

                <p className="plan-description">
                  {plan.description || (plan.tagline ? plan.tagline : "Choose this plan")}
                </p>

                <button 
                  className={`plan-button ${plan.buttonStyle} ${plan.campaign ? 'campaign-button' : ''}`}
                  onClick={
                    plan.id === 'free' ? handleGetStarted :
                    plan.id === 'enterprise' ? handleContactSales :
                    plan.id === 'newyear' ? () => handleUpgrade('newyear') :
                    () => handleUpgrade(plan.id)
                  }
                >
                  {plan.buttonText}
                  <ArrowRight size={16} />
                </button>

                <button
                  className="plan-view-features"
                  onClick={() => setSelectedPlanForFeatures(plan)}
                >
                  View features →
                </button>

                {plan.note && (
                  <p className="plan-note">{plan.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Reassurance */}
      <section className="pricing-reassurance">
        <div className="container">
          <div className="reassurance-row">
            <div className="reassurance-item">
              <CheckCircle2 size={20} />
              <span>No hidden fees</span>
            </div>
            <div className="reassurance-item">
              <CheckCircle2 size={20} />
              <span>Cancel anytime</span>
            </div>
            <div className="reassurance-item">
              <CheckCircle2 size={20} />
              <span>No card for Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="features-comparison">
        <div className="container">
          <h2 className="section-title">Compare All Plans</h2>
          <p className="section-subtitle">See exactly what you get with each plan</p>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-column">Features</div>
              <div className="plan-column">Free</div>
              <div className="plan-column popular">Pro</div>
              <div className="plan-column">Enterprise</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Conversions per month</div>
              <div className="plan-value">20</div>
              <div className="plan-value highlight-value">Unlimited</div>
              <div className="plan-value highlight-value">Unlimited</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">File formats</div>
              <div className="plan-value">Popular formats</div>
              <div className="plan-value highlight-value">All 100+</div>
              <div className="plan-value highlight-value">All 100+</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">AI processing speed</div>
              <div className="plan-value">Standard</div>
              <div className="plan-value highlight-value">Fast</div>
              <div className="plan-value highlight-value">Custom</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Support</div>
              <div className="plan-value">Community</div>
              <div className="plan-value">Email</div>
              <div className="plan-value highlight-value">Dedicated</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">File retention</div>
              <div className="plan-value">24 hours</div>
              <div className="plan-value highlight-value">Instant delete</div>
              <div className="plan-value highlight-value">Custom</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust-signals">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <Shield size={24} />
              <h4>No hidden fees</h4>
              <p>Transparent pricing. What you see is what you pay.</p>
            </div>
            <div className="trust-item">
              <Clock size={24} />
              <h4>Cancel anytime</h4>
              <p>No lock-ins. Cancel your subscription whenever you want.</p>
            </div>
            <div className="trust-item">
              <CreditCard size={24} />
              <h4>No credit card for Free</h4>
              <p>Start using Convertonix immediately. Add payment only when you upgrade.</p>
            </div>
            <div className="trust-item">
              <Sparkles size={24} />
              <h4>30-day money-back guarantee</h4>
              <p>Not satisfied? Get a full refund within 30 days — no questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who trust Convertonix for fast, AI-powered file conversion.</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={handleStartTrial}>
              <Crown size={20} />
              Start Free Trial
            </button>
            <button className="btn-outline" onClick={handleContactSales}>
              <Users size={20} />
              Contact Sales
            </button>
          </div>
          <p className="cta-note">No credit card required • Cancel anytime</p>
        </div>
      </section>
      
      <BackToTop />
      
      <PlanFeaturesModal
        plan={selectedPlanForFeatures}
        isOpen={!!selectedPlanForFeatures}
        onClose={() => setSelectedPlanForFeatures(null)}
      />
    </div>
  )
}

export default Pricing
