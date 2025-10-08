import React from 'react'
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
  Gift
} from 'lucide-react'
import Particles from '../components/Particles'

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: <Zap size={32} />,
      popular: false,
      features: [
        "100 conversions first month",
        "All formats included",
        "All AI Features",
        "Privacy-first processing",
        "Community support"
      ],
      limitations: [
        "Limited to 2 daily conversions",
        "Basic AI features only",
        "Standard support"
      ],
      buttonText: "Get Started Free",
      buttonStyle: "btn-outline"
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "per month",
      icon: <Crown size={32} />,
      popular: true,
      features: [
        "Unlimited conversions",
        "All 50+ formats",
        "Advanced AI features",
        "Batch processing",
        "Priority support",
        "No watermarks",
        "API access",
        "Team collaboration",
        "Advanced settings"
      ],
      limitations: [],
      buttonText: "Start Premium Trial",
      buttonStyle: "btn-primary",
      savings: "Save 60%"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      icon: <Users size={32} />,
      popular: false,
      features: [
        "Everything in Premium",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "On-premise deployment",
        "Custom AI models",
        "White-label solution",
        "Advanced analytics"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonStyle: "btn-outline"
    }
  ]

  const payAsYouGo = {
    name: "Pay as You Go",
    price: "$0.99",
    period: "per conversion",
    icon: <CreditCard size={32} />,
    description: "Perfect for occasional users who need premium features without a subscription",
    features: [
      "One-time payment",
      "No subscription required",
      "All premium features",
      "Valid for 30 days",
      "Perfect for occasional use"
    ],
    buttonText: "Buy Now",
    buttonStyle: "btn-secondary"
  }

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
    },
    {
      question: "What happens to my files after conversion?",
      answer: "Nothing! All processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
    },
    {
      question: "Is there a free trial for Premium?",
      answer: "Yes! New users get a 7-day free trial of Premium features. No credit card required to start."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe."
    }
  ]

  return (
    <div className="pricing-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          {/* Special Gift Banner */}
          <div className="special-gift-banner">
            <Gift size={16} />
            <span>Special Gift for New Users!</span>
          </div>
          
          <h1>
            Get <span className="highlight-green">100 FREE</span> Conversions in Your First Month!
            <br />
            Choose the Perfect Plan for You
          </h1>
          <p className="hero-subtitle">
            Sign up now and get <strong>100 conversions total for your first month!</strong> 
            Perfect for trying all features and experiencing our platform fully.
          </p>
          <div className="pricing-toggle">
            <span>Monthly</span>
            <div className="toggle-switch">
              <input type="checkbox" id="billing-toggle" />
              <label htmlFor="billing-toggle"></label>
            </div>
            <span>Yearly <span className="savings-badge">Save 20%</span></span>
          </div>
        </div>
      </section>

      {/* Main Pricing Plans */}
      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && (
                  <div className="popular-badge">
                    <Star size={16} />
                    Most Popular
                  </div>
                )}
                
                <div className="plan-header">
                  <div className="plan-icon">{plan.icon}</div>
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="savings-text">{plan.savings}</div>
                  )}
                </div>

                <div className="plan-features">
                  <h4>What's included:</h4>
                  <ul>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="plan-limitations">
                    <h4>Limitations:</h4>
                    <ul>
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx}>
                          <span className="limitation-icon">⚠️</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className={`plan-button ${plan.buttonStyle}`}>
                  {plan.buttonText}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pay as You Go */}
      <section className="pay-as-you-go">
        <div className="container">
          <div className="paygo-card">
            <div className="paygo-header">
              <div className="paygo-icon">{payAsYouGo.icon}</div>
              <div>
                <h3>{payAsYouGo.name}</h3>
                <p>{payAsYouGo.description}</p>
              </div>
              <div className="paygo-price">
                <span className="price">{payAsYouGo.price}</span>
                <span className="period">{payAsYouGo.period}</span>
              </div>
            </div>
            
            <div className="paygo-features">
              <ul>
                {payAsYouGo.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button className={`paygo-button ${payAsYouGo.buttonStyle}`}>
              <Gift size={16} />
              {payAsYouGo.buttonText}
            </button>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="features-comparison">
        <div className="container">
          <h2 className="section-title">Compare All Features</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-column">Features</div>
              <div className="plan-column">Free</div>
              <div className="plan-column popular">Premium</div>
              <div className="plan-column">Enterprise</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Daily Conversions</div>
              <div className="plan-value">2</div>
              <div className="plan-value">Unlimited</div>
              <div className="plan-value">Unlimited</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">File Formats</div>
              <div className="plan-value">20+</div>
              <div className="plan-value">50+</div>
              <div className="plan-value">50+</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">AI Features</div>
              <div className="plan-value">Basic</div>
              <div className="plan-value">Advanced</div>
              <div className="plan-value">Custom</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Batch Processing</div>
              <div className="plan-value">❌</div>
              <div className="plan-value">✅</div>
              <div className="plan-value">✅</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">API Access</div>
              <div className="plan-value">❌</div>
              <div className="plan-value">✅</div>
              <div className="plan-value">✅</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Support</div>
              <div className="plan-value">Community</div>
              <div className="plan-value">Priority</div>
              <div className="plan-value">Dedicated</div>
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
          <p>Join thousands of users who trust Convertonix for their file conversion needs.</p>
          <div className="cta-buttons">
            <button className="btn-primary">
              <Crown size={20} />
              Start Free Trial
            </button>
            <button className="btn-outline">
              <Users size={20} />
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing
